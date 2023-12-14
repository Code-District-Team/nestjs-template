import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { StripePlan } from "../stripe-webhooks/entities/stripe-plan.entity";

@Module({
  imports: [TypeOrmModule.forFeature([StripePlan])],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {
}
