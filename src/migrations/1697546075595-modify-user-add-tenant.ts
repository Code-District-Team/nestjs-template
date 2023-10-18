import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ModifyUserAddTenant1697546075595 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'tenant_id',
      type: 'uuid',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'tenant_id');
  }

}
