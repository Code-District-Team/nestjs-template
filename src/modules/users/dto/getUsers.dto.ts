import { IsEmail, IsNumber, IsString } from 'class-validator';

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
