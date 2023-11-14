import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

@Injectable()
export class StripeWebhookMiddleware implements NestMiddleware {
  endpointSecret: string;
  constructor(
    // @InjectRepository(User)
    // private userRepository: Repository<User>,
    // private readonly endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  ) {
    this.endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
  }

  async use(req: any, res: Response, next: NextFunction) {
    const { rawHeaders, headers } = req;
    const sig = headers["stripe-signature"];
    console.log({ sig });
    try {
      stripe.webhooks.constructEvent(req.rawBody, sig, this.endpointSecret);
      console.log("PASSED");
    } catch (err) {
      res.status(401).send(`Webhook Error: ${err.message}`);
      return;
    }
    next();
  }
}
