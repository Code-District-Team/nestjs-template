import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("stripe_plan")
@Index(["customerId", "object"], { unique: true })
export class StripePlan {
  @PrimaryColumn({ name: "customer_id", type: "varchar", length: "255" })
  customerId: string;

  @PrimaryColumn({ type: "varchar", length: "255" })
  object: string;

  @Column({ type: "jsonb" })
  data: any;

  @ApiProperty({ type: Date })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
