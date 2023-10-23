import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, } from 'class-validator';
import { ApiProperty, OmitType } from "@nestjs/swagger";

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

export class CreateTenantDto extends OmitType(CreateUserDto, ['email'] as const) {
  @ApiProperty({ example: 'Company Name', type: String })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'Company Website', type: String })
  @IsString()
  @IsOptional()
  companyWebsite: string;

  @ApiProperty({ example: 'Company Email', type: String })
  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;
}
