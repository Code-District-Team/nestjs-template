import { MigrationInterface, QueryRunner, Table } from "typeorm"


export class StripePlan1699970017824 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "stripe_plan",
      columns: [
        {
          name: "customer_id",
          type: "varchar",
          isNullable: false,
        },
        {
          name: "object",
          type: "varchar",
          length: "255",
          isNullable: false,
        },
        {
          name: "data",
          type: "jsonb",
          isNullable: false,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          isNullable: true,
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          isNullable: true,
          default: 'CURRENT_TIMESTAMP',
        },
      ],
      indices: [
        {
          name: "customer_id_object",
          columnNames: ["customer_id", "object"],
          isUnique: true,
        },
      ]
    }), true)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("stripe_plan", true, true, true)
  }

}
