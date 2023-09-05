import { IsEmail, IsNumber, IsString } from 'class-validator';
import { PartialType } from "@nestjs/mapped-types";

export class GetUserRequestDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;


  @IsString()
  lastName: string;

  @IsNumber()
  pageNumber: number;

  @IsNumber()
  recordsPerPage: number;
}

export class GetUserRequestDto2 extends PartialType(GetUserRequestDto) {}
