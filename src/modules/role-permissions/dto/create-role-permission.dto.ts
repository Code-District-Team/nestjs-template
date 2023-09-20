import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateRolePermissionDto {
  @IsNotEmpty()
  @IsUUID()
  roleId: string;

  @IsNotEmpty()
  @IsUUID()
  permissionId: string;
}
