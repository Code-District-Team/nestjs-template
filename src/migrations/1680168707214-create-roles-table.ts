import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { RoleEnum } from '../common/enums/role.enum';

export class createRolesTable1680168707214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'enum',
            enum: [RoleEnum.CLIENT,RoleEnum.BUSINESSPARTNER,RoleEnum.ADMIN],
            enumName: 'RoleEnum',
            default: `'CLIENT'`,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles');
  }
}
