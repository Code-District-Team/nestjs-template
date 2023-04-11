import { AddressEnum } from '../../../common/enums/address.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, name: 'street_address_1' })
  streetAddress1: string;

  @Column({ length: 255, name: 'street_address_2' })
  streetAddress2: string;

  @Column({ length: 45, name: 'flat_no' })
  flatNo: string;

  @Column({ length: 255 })
  city: string;

  @Column({ length: 255 })
  state: string;

  @Column({ name: 'zip_code', type: 'int4' })
  zipCode: number;

  @ManyToOne(() => User, (user) => user.addresses, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'type',
    type: 'enum',
    enum: AddressEnum,
    enumName: 'AddressEnum',
    // default: to be decided
  })
  type: AddressEnum;

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
}
