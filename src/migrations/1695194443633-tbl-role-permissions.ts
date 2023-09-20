import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class TblRolePermissions1695194443633 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'role_permissions',
      columns: [
        {
          name: 'role_id',
          type: 'uuid',
          foreignKeyConstraintName: 'fk_role_id',
          isNullable: false,
        },
        {
          name: 'permission_id',
          type: 'uuid',
          foreignKeyConstraintName: 'fk_permission_id',
          isNullable: false,
        },
      ],
      foreignKeys: [
        {
          name: 'fk_role_id',
          columnNames: ['role_id'],
          referencedTableName: 'roles',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      ],
      indices: [
        {
          name: 'idx_role_id',
          columnNames: ['role_id'],
        },
      ],
    }), true)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role_permissions', true, true, true);
  }

}
