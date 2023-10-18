import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableTenant1697545541101 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
          name: "tenants",
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
            },
            {
              name: "company_name",
              type: "varchar",
              length: "255",
              isNullable: true,
              isUnique: true,
            },
            {
              name: "company_website",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "company_email",
              type: "varchar",
              length: "255",
              isNullable: true,
              isUnique: true,
            },
            {
              name: "stripe_customer_id",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "is_payment_method_attached",
              type: "boolean",
              default: false,
            },
            {
              name: "created_at",
              type: "timestamp",
              default: "now()",
            },
            {
              name: "updated_at",
              type: "timestamp",
              default: "now()",
            },
          ],
        }
      ));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("tenants", true, true);
  }

}
