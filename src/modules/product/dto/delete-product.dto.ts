import { IsUUID } from "class-validator";

export class DeleteProductDto {
  @IsUUID()
  id: string;
}