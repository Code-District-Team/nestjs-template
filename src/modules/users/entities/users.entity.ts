import * as bcrypt from "bcrypt";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

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

  @Column({ length: 255, name: "role" })
  role: string;

  @Column({ length: 255, name: "picture_url" })
  pictureUrl: string;

  @Column({ length: 255, name: "uuid", nullable: true })
  uuid: string;

  @Column({ length: 255, name: "forget_password_token", nullable: true, select: false })
  forgetPasswordToken: string;
  @Column({ name: "expires", nullable: true, select: false })
  expires: number;

  @Column({ name: "subscription_status" })
  subscriptionStatus: string;

  @CreateDateColumn({ type: "timestamp", name: "created_at", default: () => "now()" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", name: "updated_at" })
  updatedAt: string;

  @DeleteDateColumn({ type: "timestamp", name: "deleted_at" })
  deletedAt: string;

  @Column({ name: "plan_id" })
  planId: number;

  async validatePassword(password: string): Promise<Boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
