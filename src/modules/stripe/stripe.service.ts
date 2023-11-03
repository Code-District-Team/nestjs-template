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

  addPaymentMethod(customerId: string, paymentMethodId: string) {
    return stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  }

  async removePaymentMethod(tenant: Tenant) {
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
      amount,
      currency: "usd",
      customer: customerId,
    });
  }

}
