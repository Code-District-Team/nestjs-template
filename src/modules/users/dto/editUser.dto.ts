import { IsNotEmpty, IsString, Matches, ValidateIf } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateIf((value) => (value.firstName ? true : false))
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ValidateIf((value) => (value.lastName ? true : false))
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ValidateIf((value) => (value.address ? true : false))
  @IsString()
  address: string;

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

  @ValidateIf((value) => (value.mobilePhone ? true : false))
  @Matches('^[+]([0-9]{1})([0-9]{10})$', '', {
    message: 'Invalid number format',
  })
  @IsNotEmpty()
  mobilePhone: string;

  @ValidateIf((value) => (value.profileImageUrl ? true : false))
  @IsString()
  profileImageUrl: string;
}
