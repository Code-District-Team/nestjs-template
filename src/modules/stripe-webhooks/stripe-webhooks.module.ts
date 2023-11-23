import { Module } from '@nestjs/common';
import { StripeWebhooksController } from './stripe-webhooks.controller';
import { StripeWebhooksService } from './stripe-webhooks.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { StripePlan } from "./entities/stripe-plan.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StripePlan])],
  controllers: [StripeWebhooksController],
  providers: [StripeWebhooksService]
})
export class StripeWebhooksModule {
}
