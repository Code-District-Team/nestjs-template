import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn, ManyToMany, JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoleEnum } from '../../../common/enums/role.enum';
import { RolePermission } from "../../role-permissions/entities/role-permission.entity";
import { Permission } from "../../permissions/entities/permission.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'roles' })
export class Role {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({
    type: 'varchar',
    default: RoleEnum.USER,
  })
  name: string;

  // @OneToMany(() => User, (user) => user.role)
  // users: User[];

  @ApiProperty({ type: [Permission] })
  @ManyToMany(type => Permission)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @ApiProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: string;
}
