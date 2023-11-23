import { Injectable } from '@nestjs/common';
import Stripe from "stripe";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { StripePlan } from "./entities/stripe-plan.entity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });


@Injectable()
export class StripeWebhooksService {

  constructor(@InjectRepository(StripePlan) private readonly stripePlanRepository: Repository<StripePlan>) {
  }

  updateCustomer(customer: Stripe.Customer) {
    return this.stripePlanRepository.save({
      customerId: customer.id,
      object: customer.object,
      data: customer,
    });
  }

  updateCustomerSubscription(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const sub = subscription.items.data[subscription.items.data.length - 1];
    return this.insertObject(customerId, subscription.object, subscription)
  }

  updateInvoicePaid(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;
    const item = invoice.lines.data[invoice.lines.data.length - 1];
    return this.insertObject(customerId, item.object, item);
  }

  updatePaymentIntent(paymentIntent: Stripe.PaymentIntent) {
    const customerId = paymentIntent.customer as string;
    return this.stripePlanRepository.save({
      customerId,
      object: paymentIntent.object,
      data: paymentIntent,
    });
  }

  private insertObject(customerId: string, object: string, data: any) {
    return this.stripePlanRepository.save({
      customerId,
      object,
      data,
    });
  }
}
