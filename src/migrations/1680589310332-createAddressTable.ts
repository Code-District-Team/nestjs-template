import { AddressEnum } from '../common/enums/address.enum';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createAddressTable1680589310332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'street_address_1',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'street_address_2',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'flat_no',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'state',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'home_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'zip_code',
            type: 'int4',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'enum',
            enum: Object.keys(AddressEnum),
            enumName: 'AddressEnum',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
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
      false,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return await queryRunner.dropTable('addresses');
  }
}
