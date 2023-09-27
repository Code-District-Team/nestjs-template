import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm"

export class TblUserCreateForeignKeyRoleId1695711492492 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey('users', new TableForeignKey({
      columnNames: ['role_id'],
      referencedTableName: 'roles',
      referencedColumnNames: ['id']
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'fk_role_id');
  }
}
