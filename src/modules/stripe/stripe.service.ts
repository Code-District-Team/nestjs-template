import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Tenant } from "../tenant/entities/tenant.entity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });


@Injectable()
export class StripeService {

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
    if (response.card_present) {
      tenant.isPaymentMethodAttached = true;
      return tenant.save();
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

  getPaymentMethods(customerId: string) {
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

  deduct(amount: number, customerId: string) {
    return stripe.charges.create({
      amount: amount * 100,
      currency: "usd",
      customer: customerId,
    });
  }

  async createPaymentIntent(amount: number, stripeCustomerId: string) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return paymentIntent.client_secret;
  }
}
