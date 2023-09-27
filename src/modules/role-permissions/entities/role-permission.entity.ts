import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Role } from "../../roles/entities/role.entity";
import { Permission } from "../../permissions/entities/permission.entity";

@Entity("role_permissions")
export class RolePermission {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ name: "role_id", type: "uuid" })
  roleId: string;

  @ManyToOne(() => Role)
  role: Role;

  @Column({ name: "permission_id", type: "uuid" })
  permissionId: string;

  @ManyToOne(() => Permission)
  permission: Permission;
}
