import { IsNotEmpty, IsNumber } from "class-validator";

export class LoginAsDto {
  @IsNotEmpty()
  orgId: number;
}
