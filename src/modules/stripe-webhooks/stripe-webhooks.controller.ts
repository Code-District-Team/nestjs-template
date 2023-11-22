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
        console.log("PaymentIntent was successful!");
        break;
      case "customer.created":
        const customer = body.data.object;
        console.log("Customer was created!");
        break;
      case "customer.subscription.created":
        const subscription = body.data.object;
        console.log("Customer subscription created!");
        break;
      case "customer.subscription.deleted":
        const subscriptionDeleted = body.data.object;
        console.log("Customer subscription deleted!");
        break;
      case "customer.subscription.updated":
        const subscriptionUpdated = body.data.object;
        return this.service.updateCustomerSubscription(subscriptionUpdated)
        break;
      case "invoice.paid":
        const invoice = body.data.object;
        console.log("Invoice paid!");
        break;
      default:
        console.log(`Unhandled event type ${body.type}`);
    }
    return "not-ok";
  }
}
