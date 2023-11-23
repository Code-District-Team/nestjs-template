import { Body, Controller, Get, Post } from '@nestjs/common';
import { StripeWebhooksService } from "./stripe-webhooks.service";
import Stripe from "stripe";

@Controller('stripe-webhooks')
export class StripeWebhooksController {
  constructor(private readonly service: StripeWebhooksService) {
  }

  @Get()
  getHello() {
    return {};
  }

  @Post()
  async handleStripeWebhook(@Body() body: Stripe.Event) {
    switch (body.type) {
      case "payment_intent.succeeded":
        const paymentIntent = body.data.object;
        return this.service.updatePaymentIntent(paymentIntent)
      case "customer.created":
        const customer = body.data.object;
        return this.service.updateCustomer(customer)
      case "customer.subscription.created":
        const subscription = body.data.object;
        return this.service.updateCustomerSubscription(subscription)
      case "customer.subscription.deleted":
        const subscriptionDeleted = body.data.object;
        return this.service.updateCustomerSubscription(subscriptionDeleted)
      case "customer.subscription.updated":
        const subscriptionUpdated = body.data.object;
        return this.service.updateCustomerSubscription(subscriptionUpdated)
      case "invoice.paid":
        const invoice = body.data.object;
        return this.service.updateInvoicePaid(invoice);
      default:
        console.log(`Unhandled event type ${body.type}`);
    }
    return "not-ok";
  }
}
