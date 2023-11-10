import { Module } from '@nestjs/common';
import { StripeWebhooksController } from './stripe-webhooks.controller';
import { StripeWebhooksService } from './stripe-webhooks.service';

@Module({
  controllers: [StripeWebhooksController],
  providers: [StripeWebhooksService]
})
export class StripeWebhooksModule {}
