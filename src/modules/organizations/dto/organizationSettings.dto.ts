import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

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
