import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createOrganizationsTable1688979019789
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'organizations',
        columns: [
          {
            name: 'id',
            type: 'int4',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'organization_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'domain_prefix',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'custom_domain',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'internal_description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'picture_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.dropTable('organizations');
  }
}
