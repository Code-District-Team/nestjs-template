import * as bcrypt from "bcrypt";
// import { RequestContext } from "src/generalUtils/requestContext";
// import { GlobalScopes } from "src/typeormGlobalScopes";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Organization } from "../organization/organization.entity";

// create a unique constraint on database level take an array of columns that should be unique
// @GlobalScopes<User>([
//   (qb, alias) =>
//     qb.andWhere(`${alias.name}.organizationId = ${RequestContext.currentRequest().body["organizationId"]}`),
// ])
@Entity()
@Unique(["email"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
  salt: string;

  @Column({ length: 255, name: "first_name" })
  firstName: string;

  @Column({ length: 255, name: "last_name" })
  lastName: string;

  @Column({ length: 255, name: "type" })
  type: string;

  @Column({ length: 255, name: "bio" })
  bio: string;

  @Column({ length: 255, name: "country" })
  country: string;

  @Column({ length: 255, name: "profile_picture" })
  profilePicture: string;

  @Column({ length: 255, name: "address" })
  address: string;

  @Column({ length: 255, name: "forget_password_token", nullable: true, select: false })
  forgetPasswordToken: string;
  @Column({ name: "expires", nullable: true, select: false })
  expires: number;

  @ManyToOne((type) => Organization, (organization) => organization.user, { eager: true })
  @JoinColumn({ name: "organization_id" })
  organization: Organization;

  @Column({ name: "organization_id" })
  organizationId: number;

  @CreateDateColumn({ type: "timestamp", name: "created_at", default: () => "now()" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: string;

  @DeleteDateColumn({ type: "timestamp", name: "deleted_at" })
  deletedAt: string;

  async validatePassword(password: string): Promise<Boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}
