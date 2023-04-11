import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddAdressDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  address: [];
}
