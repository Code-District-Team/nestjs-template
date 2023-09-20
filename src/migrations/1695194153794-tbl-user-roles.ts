import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class TblUserRoles1695194153794 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'user_roles',
      columns: [
        {
          name: 'user_id',
          type: 'uuid',
          foreignKeyConstraintName: 'fk_user_id',
          isNullable: false,
        },
        {
          name: 'role_id',
          type: 'uuid',
          foreignKeyConstraintName: 'fk_role_id',
          isNullable: false,
        },
      ],
      foreignKeys: [
        {
          name: 'fk_user_id',
          columnNames: ['user_id'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
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
          name: 'idx_user_id',
          columnNames: ['user_id'],
        }
      ],
    }), true)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_roles', true, true, true);
  }

}
