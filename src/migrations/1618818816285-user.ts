import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class user1618209802133 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "int4",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "email",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "salt",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "first_name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "last_name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "role",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "forget_password_token",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "expires",
            type: "int4",
            isNullable: true,
          },
          {
            name: "stripe_customer_id",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "subscription_status",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            isNullable: true,
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: true,
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
          },
        ],
      }),
      false
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // queryRunner.query(`DROP TABLE user`);
    return await queryRunner.dropTable("user");
  }
}
