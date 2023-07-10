import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class OrganizationDto {
  pictureUrl: string;

  @MinLength(4)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  organizationName: string;

  @MinLength(4)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  domainPrefix: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  customDomain: string;

  @IsString()
  @MaxLength(400)
  @IsOptional()
  internalDescription: string;

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

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  password: string;
}
