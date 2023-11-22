import { Injectable } from '@nestjs/common';
import Stripe from "stripe";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { StripePlan } from "./entities/stripe-plan.dto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });


@Injectable()
export class StripeWebhooksService {

  constructor(@InjectRepository(StripePlan) private readonly stripePlanRepository: Repository<StripePlan>) {
  }

  updateCustomerSubscription(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const plansPromises = [];
    for (const item of subscription.items.data) {
      plansPromises.push(this.insertObject(customerId, item.object, item));
    }
    return plansPromises;
  }

  private insertObject(customerId: string, object: string, data: any) {
    return this.stripePlanRepository.save({
      customerId,
      object,
      data,
    });
  }
}
