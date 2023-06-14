import { StatusEnum } from '../common/enums/status.enum';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUserTable1679981873792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'last_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'profile_image_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'work_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'home_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'mobile_phone',
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
          {
            name: 'forget_password_token',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'forget_password_token_expires',
            type: 'int4',
            isNullable: true,
          },
          {
            name: 'role_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [StatusEnum.ACTIVE, StatusEnum.INACTIVE, StatusEnum.PENDING],
            enumName: 'StatusEnum',
            default: `'INACTIVE'`,
          },
        ],
      }),
      false,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.dropTable('users');
  }
}
