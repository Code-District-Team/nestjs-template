import { MigrationInterface, QueryRunner } from 'typeorm';

export class roleTable1686127489057 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roles = [
      {
        name: 'USER',
      },
      {
        name: 'ADMIN',
      },
      {
        name: 'SUPER_ADMIN',
      },
    ];
    await queryRunner.manager.getRepository('roles').save(roles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository('roles').clear();
  }
}
