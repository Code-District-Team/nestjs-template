import { MigrationInterface, QueryRunner, Table } from "typeorm"

// @Entity({ name: 'products' })
// export class Product {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;
//
//     @Column({ length: 250 })
//     name: string;
//
//     @Column({ precision: 10, scale: 2, type: "decimal" })
//     price: number;
//
//     @Column({ type: "int" })
//     quantity: number;
//
//     @CreateDateColumn({
//         type: 'timestamp',
//         name: 'created_at',
//         default: () => 'now()',
//     })
//     createdAt: Date;
//
//     @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
//     updatedAt: string;
// }

export class createProdcutsTable1693484870016 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            default: 'uuid_generate_v4()',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '250',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'quantity',
            type: 'int',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }

}
