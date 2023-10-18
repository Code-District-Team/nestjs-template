import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';

@Entity({ name: 'tenants' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true, unique: true, })
  companyName: string;

  @Column({ name: 'company_website', type: 'varchar', length: 255, nullable: true, })
  companyWebsite: string;

  @Column({ name: 'company_email', type: 'varchar', length: 255, nullable: true, unique: true, })
  companyEmail: string;

  @Column({ name: 'stripe_customer_id', type: 'varchar', length: 255, nullable: true, })
  stripeCustomerId: string;

  @Column({ name: 'is_payment_method_attached', type: 'boolean', default: false, })
  isPaymentMethodAttached: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: 'now()', })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: 'now()', })
  updatedAt: Date;
}
