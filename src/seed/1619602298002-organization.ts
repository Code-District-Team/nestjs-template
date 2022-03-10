import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
const OrganizationSeed = [
  {
    organizationName: "Megilla",
    domainPrefix: "megilla",
    customDomain: null,
    internalDescription: "organization 1",
  },
  {
    organizationName: "organization 2",
    domainPrefix: "organization 2",
    customDomain: "organization 2",
    internalDescription: "organization 2",
    createdAt: `${new Date()}`,
    updatedAt: `${new Date()}`,
  },
];

export class organization1619602298002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getRepository("organization").save(OrganizationSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
