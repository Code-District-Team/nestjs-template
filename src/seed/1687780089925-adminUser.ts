import * as bcrypt from 'bcryptjs';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class adminUser1687780089925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRole = await queryRunner.manager
      .getRepository('roles')
      .findOneBy({ name: 'ADMIN' });
    const adminUser = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'saim.ashfaq+admin@codedistrict.com',
      mobilePhone: '+13223269753',
      password: bcrypt.hashSync(
        '25d55ad283aa400af464c76d713c07ad',
        bcrypt.genSaltSync(),
      ),
      role: userRole.id,
      status: 'ACTIVE',
    };
    await queryRunner.manager.getRepository('users').save(adminUser);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager
      .getRepository('users')
      .findOneBy({ email: 'saim.ashfaq+admin@codedistrict.com' });
    if (user) {
      await queryRunner.manager.getRepository('users').remove(user);
    }
  }
}
