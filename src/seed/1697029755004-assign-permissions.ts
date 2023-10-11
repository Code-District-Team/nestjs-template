import { In, MigrationInterface, QueryRunner } from "typeorm"
import { Role } from "../modules/roles/entities/role.entity";
import { Permission } from "../modules/permissions/entities/permission.entity";

export class AssignPermissions1697029755004 implements MigrationInterface {
  userPermissions = ["Read.User", "Read.Product"];
  adminPermissions = ["Admin"];

  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminRol: Role = await queryRunner.manager.getRepository("roles")
      .findOne({ where: { name: "ADMIN" } }) as Role;
    adminRol.permissions = await queryRunner.manager.getRepository("permissions")
      .find({ where: { code: In(this.adminPermissions) } }) as Permission[];
    await queryRunner.manager.save(adminRol);
    const userRol: Role = await queryRunner.manager.getRepository("roles")
      .findOne({ where: { name: "User" } }) as Role;
    userRol.permissions = await queryRunner.manager.getRepository("permissions")
      .find({ where: { code: In(this.userPermissions) } }) as Permission[];
    await queryRunner.manager.save(userRol);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
