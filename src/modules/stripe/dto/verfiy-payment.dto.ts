import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyPaymentDto {
  @ApiProperty({ description: "payment_intent" })
  @IsNotEmpty()
  @IsString()
  payment_intent: string;

  @ApiProperty({ description: "payment_intent_client_secret" })
  @IsNotEmpty()
  @IsString()
  payment_intent_client_secret: string;

  @ApiProperty({ description: "redirect_status" })
  @IsNotEmpty()
  @IsString()
  redirect_status: string;
}