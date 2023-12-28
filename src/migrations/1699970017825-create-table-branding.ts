import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateTableBranding1699970017825 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
          name: "brandings",
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
            },
            {
              name: "primary_color",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "secondary_color",
              type: "varchar",
              length: "255",
              isNullable: true,
            },
            {
              name: "foreground_text_color",
              type: "varchar",
              length: "255",
              isNullable: true,
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
    await queryRunner.dropTable("brandings", true, true);
  }

}
