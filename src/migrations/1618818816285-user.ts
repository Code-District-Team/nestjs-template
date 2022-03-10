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
            isUnique: true,
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
            name: "type",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "bio",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "country",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "profile_picture",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "address",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "organization_id",
            type: "int4",
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
    // await queryRunner.createForeignKey(
    //   "user",
    //   new TableForeignKey({
    //     columnNames: ["organization_id"],
    //     referencedTableName: "organization",
    //     referencedColumnNames: ["id"],
    //   })
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // queryRunner.query(`DROP TABLE user`);
    return await queryRunner.dropTable("user");
  }
}
