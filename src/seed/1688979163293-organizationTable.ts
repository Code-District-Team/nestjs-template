import { MigrationInterface, QueryRunner } from 'typeorm';

export class organizationTable1688979163293 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const organizations = [
      {
        organizationName: 'Code District',
        domainPrefix: 'codedistrict',
        customDomain: 'https://www.codedistrict.com',
        internalDescription: 'Delivering software products beyond expectations',
      },
      {
        organizationName: 'Test Organization',
        domainPrefix: 'testorganization',
        customDomain: 'null',
        internalDescription: 'No description',
      },
    ];
    await queryRunner.manager
      .getRepository('organizations')
      .save(organizations);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository('organizations').clear();
  }
}
