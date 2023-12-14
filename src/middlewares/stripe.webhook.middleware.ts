import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import Stripe from "stripe";
import * as process from "process";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

@Injectable()
export class StripeWebhookMiddleware implements NestMiddleware {
  endpointSecret: string;

  constructor() {
    this.endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  }

  async use(req: any, res: Response, next: NextFunction) {
    const { rawHeaders, headers } = req;
    const sig = headers["stripe-signature"];
    try {
      stripe.webhooks.constructEvent(req.rawBody, sig, this.endpointSecret);
    } catch (err) {
      res.status(401).send();//`Webhook Error: ${err.message}`);
      return;
    }
    next();
  }
}
