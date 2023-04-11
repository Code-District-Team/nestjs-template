import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { AddressEnum } from 'src/common/enums/address.enum';
import { Address } from '../entities/address.entity';

export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateIf((value) => (value.firstName ? true : false))
  @IsString()
  firstName: string;

  @ValidateIf((value) => (value.lastName ? true : false))
  @IsString()
  lastName: string;

  @ValidateIf((value) => (value.workPhone ? true : false))
  @Matches('^[+]([0-9]{1})([0-9]{10})$', '', {
    message: 'Invalid number format',
  })
  workPhone: string;

  @ValidateIf((value) => (value.homePhone ? true : false))
  @Matches('^[+]([0-9]{1})([0-9]{10})$', '', {
    message: 'Invalid number format',
  })
  homePhone: string;

  @Matches('^[+]([0-9]{1})([0-9]{10})$', '', {
    message: 'Invalid number format',
  })
  @IsNotEmpty()
  mobilePhone: string;
}

// export class AddressDto {
//   @IsString()
//   streetAddress1: string;

//   @IsString()
//   streetAddress2: string;

//   @IsString()
//   flatNo: string;

//   @IsString()
//   city: string;

//   @IsNumber()
//   zipCode: number;

//   @IsEnum(AddressEnum)
//   type: string;
// }
