import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ModifyTenantAddBrandingCol1699970017826 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('tenants', new TableColumn({
      name: 'branding_id',
      type: 'uuid',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tenants', 'branding_id');
  }
}