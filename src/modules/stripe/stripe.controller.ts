import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { StripeService } from "./stripe.service";
import { CurrentUser } from "../../decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { AddPaymentMethod } from "./dto/create-tenant.dto";
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { VerifyPaymentDto } from "./dto/verfiy-payment.dto";

@ApiTags('Stripe')
@ApiBearerAuth('JWT-auth')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {
  }

  @ApiOperation({ summary: "Add card" })
  @ApiBody({ type: AddPaymentMethod })
  @Post("add-payment-method")
  createPaymentMethod(@Body() { paymentMethodId }: AddPaymentMethod, @CurrentUser() user: User) {
    // TODO: Tenant
    const customerId = user.tenant.stripeCustomerId;
    // TODO: User
    // const customerId = user.stripeCustomerId;
    return this.stripeService.addPaymentMethod(user.tenant, paymentMethodId);
  }

  @ApiOperation({ summary: "Remove card" })
  @Delete('remove-payment-method')
  removeMethod(@CurrentUser() user: User) {
    return this.stripeService.removePaymentMethod(user.tenant);
  }

  @ApiOperation({ summary: "Deduct amount" })
  @ApiBody({ type: Number })
  @Post("deduct-amount")
  deductAmount(@Body() { amount }: { amount: number }, @CurrentUser() user: User) {
    // TODO: User
    // return this.stripeService.deduct(amount, user.stripeCustomerId);
    // TODO: Tenant
    return this.stripeService.deduct(amount, user.tenant.stripeCustomerId);
  }

  @ApiOperation({ summary: "Create payment intent" })
  @ApiBody({ type: Number })
  @Post("create-payment-intent")
  // createPaymentIntent(@Body() { amount }: { amount: number }, @CurrentUser() user: User) {
  createPaymentIntent() {
    // TODO: User
    // return this.stripeService.createPaymentIntent(amount, user.stripeCustomerId);
    // TODO: Tenant
    return this.stripeService.createPaymentIntent(120, null);//, user.tenant.stripeCustomerId);
  }

  @ApiOperation({ summary: "Get payment methods" })
  @Get("payment-methods")
  getPaymentMethods(@CurrentUser() user: User) {
    // TODO: User
    // return this.stripeService.getPaymentMethods(user.stripeCustomerId);
    // TODO: Tenant
    return this.stripeService.getPaymentMethods(user.tenant.stripeCustomerId);
  }

  // verify payment: payment_intent=pi_3OBuomF8kfyxaVXE14GlaO6N&payment_intent_client_secret=pi_3OBuomF8kfyxaVXE14GlaO6N_secret_K5AAUTq8m326TsuwO3NqMeJIa&redirect_status=succeeded
  @ApiOperation({ summary: "Verify payment" })
  @Get("verify-payment")
  verifyPayment(@Query() payment: VerifyPaymentDto) {
    return this.stripeService.verifyPayment(payment);
  }
}
