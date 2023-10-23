import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength, } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: 'John', type: String })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', type: String })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'test@example.com', type: String })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'mobilePhone', type: String })
  @IsNotEmpty()
  @Matches('^[+]([0-9]{1})([0-9]{10})$', '', {
    message: 'Invalid Number Format',
  })
  mobilePhone: string;

  @ApiProperty({ example: 'password', type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(8)
  password: string;
}
