import { Controller } from '@nestjs/common';
import { StripeWebhooksService } from "./stripe-webhooks.service";

@Controller('stripe-webhooks')
export class StripeWebhooksController {
  constructor(private readonly service: StripeWebhooksService) {
  }


}
