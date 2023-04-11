import {
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  
  export class ForgetPasswordDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
  }