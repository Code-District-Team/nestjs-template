import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class AddPaymentMethod {
  @ApiProperty()
  @IsString()
  @MaxLength(27)
  @MinLength(27)
  paymentMethodId: string;
}
