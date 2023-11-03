import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ModifyUserToSaveStripe1699011536035 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn(
        {
          name: "stripe_customer_id",
          type: "varchar",
          length: "255",
          isNullable: true,
        }),
      new TableColumn(
        {
          name: "is_payment_method_attached",
          type: "boolean",
          default: false,
        }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'stripe_customer_id');
    await queryRunner.dropColumn('users', 'is_payment_method_attached');
  }

}
