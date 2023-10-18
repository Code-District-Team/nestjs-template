import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Unique } from 'src/decorators/unique.decorator';

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  // @Unique('User')
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
