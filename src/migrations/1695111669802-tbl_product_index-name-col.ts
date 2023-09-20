import { MigrationInterface, QueryRunner } from "typeorm"

export class TblProductIndexNameCol1695111669802 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX idx_products_name;
    `);
  }

}
