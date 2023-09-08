import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Heroes1694156672743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'hero',
      columns: [
        { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: 'name', type: 'varchar', length: '250' },
        { name: 'power', type: 'int' },
      ]
    }), true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('hero');
  }
}
