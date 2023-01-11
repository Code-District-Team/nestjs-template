import { stringValueMaxLength1000 } from "aws-sdk/clients/finspacedata";
import { IsEmail, IsNotEmpty, IsString, MaxLength, IsOptional, ValidateIf } from "class-validator";
import { mailSubjects } from "src/modules/auth/constants";

export class UserDto {
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
  @MaxLength(100)
  password: string;
}
export class LoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}
export class UserProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  pictureUrl: string;

  email: string;
}
export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  newPassword: string;
}
export class ForgetPasswordDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}
export class ContactUsDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @ValidateIf((o) => o.subject === mailSubjects.CONTACT_US_EDUCATION)
  @IsString()
  @IsNotEmpty()
  school: string;

  @ValidateIf((o) => o.subject === mailSubjects.CONTACT_US_BUSINESS || o.subject === mailSubjects.CONTACT_US_EDUCATION)
  @IsString()
  location: string;

  @ValidateIf((o) => o.subject === mailSubjects.CONTACT_US_BUSINESS)
  @IsString()
  title: string;

  @ValidateIf((o) => o.subject === mailSubjects.CONTACT_US_BUSINESS)
  @IsString()
  sizeOfOrganization: string;

  @ValidateIf((o) => o.subject === mailSubjects.CONTACT_US_BUSINESS)
  @IsString()
  numberOfNamePlayerUsers: string;

  @ValidateIf((o) => o.subject === mailSubjects.CONTACT_US_BUSINESS)
  @IsString()
  @IsNotEmpty()
  organization?: string;
}

export class BlockUser {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  isBlocked: boolean;
}
