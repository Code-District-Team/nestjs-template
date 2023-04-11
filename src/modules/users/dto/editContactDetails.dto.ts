import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class EditContactDto {
  @ValidateIf((value) => (value.workPhone ? true : false))
  @Matches('^[+]([0-9]{1})([0-9]{10})$')
  workPhone: string;

  @ValidateIf((value) => (value.homePhone ? true : false))
  @Matches('^[+]([0-9]{1})([0-9]{10})$')
  homePhone: string;

  @ValidateIf((value) => (value.mobilePhone ? true : false))
  @Matches('^[+]([0-9]{1})([0-9]{10})$')
  mobilePhone: string;
}
