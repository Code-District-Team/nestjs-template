import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    MinLength,
    ValidateIf,
  } from 'class-validator';
  import { Unique } from 'src/decorators/unique.decorator';
  
  export class InviteUserDto {

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsUUID()
    @IsNotEmpty()
    roleId: string;
  }
  