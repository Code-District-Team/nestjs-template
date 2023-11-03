import { Body, Controller, Get, Post } from '@nestjs/common';
import { StripeService } from "./stripe.service";
import { CurrentUser } from "../../decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { AddPaymentMethod } from "./dto/create-tenant.dto";

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {
  }

  @Post("add-payment-method")
  createPaymentMethod(@Body() { paymentMethodId }: AddPaymentMethod, @CurrentUser() user: User) {
    // TODO: Tenant
    const customerId = user.tenant.stripeCustomerId;
    // TODO: User
    // const customerId = user.stripeCustomerId;
    return this.stripeService.addPaymentMethod(customerId, paymentMethodId);
  }

  @Get('remove-payment-method')
  removeMethod(@CurrentUser() user: User) {
    return this.stripeService.removePaymentMethod(user.tenant);
  }

  @Post("deduct-amount")
  deductAmount(@Body() { amount }: { amount: number }, @CurrentUser() user: User) {
    // TODO: User
    // return this.stripeService.deduct(amount, user.stripeCustomerId);
    // TODO: Tenant
    return this.stripeService.deduct(amount, user.tenant.stripeCustomerId);
  }
}
