import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

// await queryRunner.createTable(new Table({
//   name: "stripe_plan",
//   columns: [
//     {
//       name: "customer_id",
//       type: "varchar",
//       isNullable: false,
//     },
//     {
//       name: "object",
//       type: "varchar",
//       length: "255",
//       isNullable: false,
//     },
//     {
//       name: "data",
//       type: "jsonb",
//       isNullable: false,
//     },
//     {
//       name: 'created_at',
//       type: 'timestamp',
//       isNullable: true,
//       default: 'CURRENT_TIMESTAMP',
//     },
//     {
//       name: 'updated_at',
//       type: 'timestamp',
//       isNullable: true,
//       default: 'CURRENT_TIMESTAMP',
//     },
//   ],
//   indices: [
//     {
//       name: "customer_id_object",
//       columnNames: ["customer_id", "object"],
//       isUnique: true,
//     },
//   ]
// }), true)

@Entity("stripe_plan")
export class StripePlan {
  @PrimaryColumn({ type: "varchar", length: "255" })
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
