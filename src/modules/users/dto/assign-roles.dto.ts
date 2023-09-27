import { IsArray, IsNotEmpty, IsUUID } from "class-validator";

export class AssignRolesDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID("4", { each: true })
  roleIds: string[];
}
