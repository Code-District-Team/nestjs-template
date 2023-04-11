import { MigrationInterface, QueryRunner } from 'typeorm';

export class userTable1680071438201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const roles = [
      {
        name: 'CLIENT',
      },
      {
        name: 'BUSINESSPARTNER',
      },
      {
        name: 'ADMIN',
      },
    ];
    await queryRunner.manager.getRepository('roles').save(roles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
