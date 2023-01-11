import { getRepository, MigrationInterface, QueryRunner } from "typeorm";

export class superAdmin1619602616800 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const SuperAdminSeed = [
      {
        email: "admin@admin.com",
        password: "$2b$10$SVJEvjT20DqcwEbscfL1m.5vyKwecOS.u/QxXZlzEKMdxhbRj0P5e",
        salt: "$2b$10$SVJEvjT20DqcwEbscfL1m.",
        firstName: "Super",
        lastName: "Admin 1",
        role: "ADMIN",
        created_at: `${new Date()}`,
        updated_at: `${new Date()}`,
      },
    ];
    await getRepository("user").save(SuperAdminSeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
