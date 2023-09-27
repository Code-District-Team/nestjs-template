import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  code: string;
}
