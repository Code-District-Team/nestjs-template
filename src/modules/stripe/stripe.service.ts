import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Tenant } from "../tenant/entities/tenant.entity";
import { convertDollarsToCents } from "../../generalUtils/helper";
import { VerifyPaymentDto } from "./dto/verfiy-payment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { StripePlan } from "../stripe-webhooks/entities/stripe-plan.entity";
import { Repository } from "typeorm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });


@Injectable()
export class StripeService {

  constructor(@InjectRepository(StripePlan) private readonly stripePlanRepository: Repository<StripePlan>) {
  }

  async createCustomer(name: string, email: string) {
    return stripe.customers.create({
      name,
      email,
    });
  }

  async addPaymentMethod(tenant: Tenant, paymentMethodId: string) {
    await this.removePaymentMethod(tenant);
    const response = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: tenant.stripeCustomerId,
    });
    if (response.card) {
      tenant.isPaymentMethodAttached = true;
      await tenant.save();
      return response;
    }
    return tenant;
  }

  async removePaymentMethod(tenant: Tenant) {
    if (!tenant.stripeCustomerId)
      return tenant;
    const paymentLists = await this.getPaymentMethods(tenant.stripeCustomerId);
    if (paymentLists.data.length) {
      await Promise.all(paymentLists.data.map((paymentMethod) => {
        stripe.paymentMethods.detach(paymentMethod.id);
      }));
    }
    tenant.isPaymentMethodAttached = false;
    return tenant.save();
  }

  async getPaymentMethods(customerId: string) {
    return stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });
  }

  invoiceCustomer(customerId: string, limit: number = 100) {
    return stripe.invoices.list({
      customer: customerId,
      expand: ["data.charge", "data.charge.refunds"],
      status: "paid",
      limit,
    });
  }

  async createStripeInvoiceItem(invoiceId: string, stripeInfo: any) {
    return stripe.invoiceItems.create({
      customer: stripeInfo.stripeCustomerId,
      invoice: invoiceId,
      amount: convertDollarsToCents(stripeInfo.amount),
      description: stripeInfo.description,
      currency: "USD",
    });
  }

  createSubscriptionSession(price: string, customer: string) {
    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer,
      success_url: 'https://your-website.com/success',
      cancel_url: 'https://your-website.com/cancel',
    });
  }

  // update subscription session
  async updateSubscription(customer: string) {
    const subscriptionItem = await this.stripePlanRepository.findOne({
      where: {
        customerId: customer,
        object: "subscription_item"
      }
    });
    // if (!subscriptionItem)
    //   throw new HttpException("No subscription item found", 400);
    // const subscriptionData = JSON.parse(subscriptionItem.data);
    const portal = await stripe.billingPortal.sessions.create({
      customer,
      return_url: 'https://your-website.com/account',
    });
    // enable cancel subscription
    await stripe.billingPortal.configurations.update(portal.configuration.toString(), {
      features: {
        subscription_cancel: {
          enabled: true,
        },
        subscription_update: {
          enabled: false,
        },
      },
    });
    return `${portal.url}`;///subscriptions/sub_1OFESnF8kfyxaVXE7zuYBvqP`;//${subscriptionData.subscription_item}`;
  }

  async deduct(amount: number, customerId: string) {
    const payList = await this.getPaymentMethods(customerId);
    if (!payList.data.length)
      throw new HttpException("No card is attached", 400);
    const invoiceCreation = await stripe.invoices.create({
      customer: customerId,
    });
    const invoice = await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoiceCreation.id,
      amount: convertDollarsToCents(amount),
      description: `Deducted ${amount} from your account`,
      currency: "USD",
    });
    // finalizing the invoice
    const invoiceFinalize = await stripe.invoices.finalizeInvoice(invoiceCreation.id);
    const paymentIntentConfirmation = await stripe.paymentIntents.confirm(invoiceFinalize.payment_intent.toString(), {
      payment_method: payList.data[0].id,
      return_url: process.env.STRIPE_RETURN_URL,
    });
    if (paymentIntentConfirmation.next_action !== null && paymentIntentConfirmation.status !== "succeeded") {
      return {
        url: paymentIntentConfirmation.next_action.redirect_to_url.url,
        ...paymentIntentConfirmation,
      };
    }
    return paymentIntentConfirmation;
  }

  async createPaymentIntent(amount: number, stripeCustomerId: string) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async verifyPayment(payment: VerifyPaymentDto) {
    const { payment_intent, payment_intent_client_secret, redirect_status } = payment
    const paymentInfo = await stripe.paymentIntents.retrieve(payment_intent);
    if (paymentInfo.status === "succeeded" && paymentInfo.client_secret === payment_intent_client_secret) {
      return {
        message: "Payment successful",
      };
    }
    throw new HttpException({ message: 'payment was not successful' }, HttpStatus.PAYMENT_REQUIRED);
  }
}
