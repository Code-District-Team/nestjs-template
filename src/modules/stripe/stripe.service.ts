import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });


@Injectable()
export class StripeService {


  async createCustomer(name: string, email: string) {
    return stripe.customers.create({
      name,
      email,
    });
  }

  addPaymentMethod(customerId: string, paymentMethodId: string) {
    return stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
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

}
