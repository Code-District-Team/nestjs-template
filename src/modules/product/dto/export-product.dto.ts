import { IsArray, IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class ExportProductDto {
  @ApiProperty({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[]
}