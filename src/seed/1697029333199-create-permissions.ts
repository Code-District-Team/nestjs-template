import { MigrationInterface, QueryRunner } from "typeorm"
import { Permission } from "../modules/permissions/entities/permission.entity";

export class CreatePermissions1697029333199 implements MigrationInterface {
    permissions: Permission[] = [
        new Permission("Admin", "Admin"),
        new Permission("Read User", "Read.User"),
        new Permission("Write User", "Write.User"),
        new Permission("Read Product", "Read.Product"),
        new Permission("Write Product", "Write.Product"),
    ];
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.save(this.permissions);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.delete(Permission, this.permissions);
    }

}
