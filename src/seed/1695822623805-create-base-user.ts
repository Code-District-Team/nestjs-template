import { MigrationInterface, QueryRunner } from "typeorm"
import { User } from "../modules/users/entities/user.entity";
import { StatusEnum } from "../common/enums/status.enum";

export class CreateBaseUser1695822623805 implements MigrationInterface {
    #role = "ADMIN";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const role = await queryRunner.query(`SELECT * FROM roles WHERE name = '${this.#role}'`);
        const user = new User();
        user.email = "admin@codedistrict.com";
        user.firstName = "Code";
        user.lastName = "District";
        user.roles = [role];
        user.password = "$2a$10$FitB.ACRgu18P6ac5pnafeiUhPnTepC7.omcT3QU2pjUsX5CzUSdS";
        user.status = StatusEnum.ACTIVE;
        // create
        await queryRunner.manager.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
