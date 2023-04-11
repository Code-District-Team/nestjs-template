import { StatusEnum } from '../../../common/enums/status.enum';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Role } from '../../roles/entities/role.entity';
import { Address } from './address.entity';
// @Unique('my_personal_unique', ['username', 'email'])
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

  @Column({ length: 12, name: 'work_phone', nullable: true, select: false })
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
  @Column({ name: 'expires', nullable: true, select: false })
  expires: number;

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

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
  
  @Column({
    type: 'enum',
    enum: StatusEnum,
    enumName: 'StatusEnum',
    default: StatusEnum.INACTIVE,
  })
  status: StatusEnum;

}
