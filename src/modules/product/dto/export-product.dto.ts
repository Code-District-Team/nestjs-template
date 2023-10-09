import { IsArray, IsNotEmpty, IsUUID } from "class-validator";


export class ExportProductDto {
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[]
}