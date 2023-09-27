import { StatusEnum } from '../../../common/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, name: 'first_name' })
  firstName: string;

  @Column({ length: 255, name: 'last_name' })
  lastName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl: string;

  @Column({ length: 12, name: 'work_phone', nullable: true })
  workPhone: string;

  @Column({ length: 12, name: 'home_phone', nullable: true, select: false })
  homePhone: string;

  @Column({ length: 12, name: 'mobile_phone' })
  mobilePhone: string;

  @Column({
    length: 255,
    name: 'forget_password_token',
    nullable: true,
    select: false,
  })
  forgetPasswordToken: string;

  @Column({
    name: 'forget_password_token_expires',
    nullable: true,
    select: false,
  })
  forgetPasswordTokenExpires: number;

  // @ManyToOne((type) => Organization, (organization) => organization.user, {
  //   eager: true,
  // })
  // @JoinColumn({ name: 'organization_id' })
  // organization: Organization;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: string;

  // @ManyToOne(() => Role, (role) => role.users, { eager: true })
  // @JoinColumn({ name: 'role_id' })
  // role: Role;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @Column({
    type: 'enum',
    enum: StatusEnum,
    enumName: 'StatusEnum',
    default: StatusEnum.INACTIVE,
  })
  status: StatusEnum;
}
