import { StatusEnum } from '../../../common/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../roles/entities/role.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ example: '1', description: 'Unique identifier', type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'First Name', type: String })
  @Column({ length: 255, name: 'first_name' })
  firstName: string;

  @ApiProperty({ example: 'Last Name', type: String })
  @Column({ length: 255, name: 'last_name' })
  lastName: string;

  @ApiProperty({ example: 'Email', type: String })
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @ApiProperty({ example: 'Address', type: String })
  @Column()
  address: string;

  @ApiProperty({ example: 'Image url', type: String })
  @Column({ name: 'profile_image_url', nullable: true })
  profileImageUrl: string;

  @ApiProperty({ example: 'phone', type: String })
  @Column({ length: 12, name: 'work_phone', nullable: true })
  workPhone: string;

  @ApiProperty({ example: 'phone', type: String })
  @Column({ length: 12, name: 'home_phone', nullable: true, select: false })
  homePhone: string;

  @ApiProperty({ example: 'phone', type: String })
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

  @ApiProperty({ type: Date })
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: string;

  @ApiProperty({ type: [Role] })
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

  @ApiProperty({ enum: StatusEnum, type: String, default: StatusEnum.INACTIVE })
  @Column({
    type: 'enum',
    enum: StatusEnum,
    enumName: 'StatusEnum',
    default: StatusEnum.INACTIVE,
  })
  status: StatusEnum;
}
