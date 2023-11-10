import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class AddPaymentMethod {
  @ApiProperty({ example: "pm_1J4Y2n2eZvKYlo2C2X2X2X2X2" })
  @IsString()
  @MaxLength(27)
  @MinLength(27)
  paymentMethodId: string;
}
