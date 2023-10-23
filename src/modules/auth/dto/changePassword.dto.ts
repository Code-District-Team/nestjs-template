import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword', type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  oldPassword: string;

  @ApiProperty({ example: 'newPassword', type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(8)
  newPassword: string;
}
