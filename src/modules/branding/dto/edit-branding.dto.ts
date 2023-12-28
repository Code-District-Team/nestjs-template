import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsUUID,
} from 'class-validator';

export class EditBrandingDto {
  @ApiProperty({
    description: "id",
    example: "3e2e-23e23sszda12-dqwdq-12e23",
    maximum: 255,
    minimum: 1,
  })
  @IsString()
  @IsUUID()
  
  id: string;

  @ApiProperty({
    description: "primaryColor",
    example: "red",
    maximum: 255,
    minimum: 1,
  })
  @IsString()
  primaryColor: string;

  @ApiProperty({
    description: "secondaryColor",
    example: "green",
    maximum: 255,
    minimum: 1,
  })
  @IsString()
  secondaryColor: string;

  @ApiProperty({
    description: "foregroundTextColor",
    example: "black",
    maximum: 255,
    minimum: 1,
  })
  @IsString()
  foregroundTextColor: string;
}
