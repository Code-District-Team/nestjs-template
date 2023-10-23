import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class ForgetPasswordDto {
  @ApiProperty({ example: 'test@example.com', type: String })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}