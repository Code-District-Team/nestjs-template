import { Column, ManyToOne, PrimaryColumn } from "typeorm";
import { Role } from "../../roles/entities/role.entity";
import { User } from "../../users/entities/user.entity";

export class UserRole {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User, (user) => user.roles)
  user: User;

  @Column({ type: "uuid" })
  roleId: string;

  @ManyToOne(() => Role)
  role: Role;

}
