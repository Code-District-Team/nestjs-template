import { MigrationInterface, QueryRunner } from "typeorm"
import { Role } from "../modules/roles/entities/role.entity";

export class CreateRole1695822610151 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const role = new Role();
        role.name = "ADMIN";
        await queryRunner.manager.save(role);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
