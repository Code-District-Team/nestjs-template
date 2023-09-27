import { MigrationInterface, QueryRunner } from "typeorm"
import { User } from "../modules/users/entities/user.entity";
import { StatusEnum } from "../common/enums/status.enum";
import { Role } from "../modules/roles/entities/role.entity";
import * as bcrypt from 'bcryptjs';

export class CreateBaseUser1695822623805 implements MigrationInterface {
    #role = "ADMIN";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const role: Role = (await queryRunner.query(`SELECT * FROM roles WHERE name = '${this.#role}'`))[0];
        const user = new User();
        user.email = "admin@codedistrict.com";
        user.firstName = "Code";
        user.lastName = "District";
        user.roles = [role];
        user.password = bcrypt.hashSync("e6e061838856bf47e1de730719fb2609", bcrypt.genSaltSync())
        user.status = StatusEnum.ACTIVE;
        // create
        await queryRunner.manager.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
