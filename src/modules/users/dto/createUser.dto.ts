import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, } from 'class-validator';
import { OmitType } from "@nestjs/swagger";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches('^[+]([0-9]{1})([0-9]{10})$', '', {
    message: 'Invalid Number Format',
  })
  mobilePhone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(8)
  password: string;
}

export class CreateTenantDto extends OmitType(CreateUserDto, ['email'] as const) {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsOptional()
  companyWebsite: string;

  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;
}
