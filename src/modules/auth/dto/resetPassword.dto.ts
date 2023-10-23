import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


export class ResetPasswordDto {
  @ApiProperty({ example: 'newPassword', type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}