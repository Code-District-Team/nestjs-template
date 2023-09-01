import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator";


export class CreateProductDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: "name must be longer than or equal to 1 characters" })
  @MaxLength(255, { message: "name must be shorter than or equal to 255 characters" })
  name: string;

  @IsNumber()
  @Min(0, { message: "quantity must be greater than or equal to 0" })
  @Max(2_147_483_647, { message: "quantity must be less than or equal to 2,147,483,647" })
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Max(99_999_999.99, { message: "price must be less than or equal to 99,999,999.99" })
  price: number;
}