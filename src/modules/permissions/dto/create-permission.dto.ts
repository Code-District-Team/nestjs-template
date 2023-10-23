import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePermissionDto {
  @ApiProperty({ type: String, maximum: 250, required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;

  @ApiProperty({ type: String, maximum: 250, required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  code: string;
}
