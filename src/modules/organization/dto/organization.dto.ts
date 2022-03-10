import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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

export class GetOrganizationDto {
  @IsNumber()
  pageNumber: number;
  @IsNumber()
  recordsPerPage: number;
  organizationName: string;
}

export class OrganizationSettingsDto {
  @MinLength(4)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  pictureUrl: string;
  @MinLength(4)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  internalDescription: string;
  @MinLength(4)
  @MaxLength(255)
  @IsString()
  longDescription: string;
  @IsString()
  @IsNotEmpty()
  backgroundColor: string;
  @IsString()
  @IsNotEmpty()
  headerColor: string;
  @IsString()
  @IsNotEmpty()
  buttonColor: string;
  @IsString()
  @IsNotEmpty()
  accentColor: string;
}
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
