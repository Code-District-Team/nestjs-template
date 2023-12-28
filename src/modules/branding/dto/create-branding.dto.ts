import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class CreateBrandingDto {
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
