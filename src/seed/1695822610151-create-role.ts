import { MigrationInterface, QueryRunner } from "typeorm"
import { Role } from "../modules/roles/entities/role.entity";

export class CreateRole1695822610151 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const role1 = new Role();
    role1.name = "ADMIN";
    const role2 = new Role();
    role2.name = "User";
    await queryRunner.manager.save([role1, role2]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
