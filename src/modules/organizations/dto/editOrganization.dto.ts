import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EditOrganizationDto {
  @IsNumber()
  @IsNotEmpty()
  organizationId: number;

  pictureUrl: string;

  @MinLength(4)
  @MaxLength(255)
  @IsString()
  organizationName: string;

  @MinLength(4)
  @MaxLength(255)
  @IsString()
  domainPrefix: string;

  @MinLength(4)
  @MaxLength(255)
  @IsString()
  customDomain: string;

  @MinLength(4)
  @MaxLength(255)
  @IsString()
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
  @IsString()
  password: string;
}
