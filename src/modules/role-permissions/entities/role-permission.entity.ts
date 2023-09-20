import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Role } from "../../roles/entities/role.entity";
import { Permission } from "../../permissions/entities/permission.entity";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  role: Role;

  @Column({ type: "uuid" })
  permissionId: string;

  @ManyToOne(() => Permission)
  permission: Permission;
}
