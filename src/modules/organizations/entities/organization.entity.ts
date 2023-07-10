import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, name: 'organization_name' })
  organizationName: string;

  @Column({ length: 255, name: 'domain_prefix' })
  domainPrefix: string;

  @Column({ length: 255, name: 'custom_domain' })
  customDomain: string;

  @Column({ length: 255, name: 'internal_description' })
  internalDescription: string;

  @Column({ length: 255, name: 'picture_url' })
  pictureUrl: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'now()',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', select: false })
  updatedAt: string;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', select: false })
  deletedAt: string;

  //   @OneToMany((type) => User, (user) => user.organization, { eager: false })
  //   user: User[];
}
