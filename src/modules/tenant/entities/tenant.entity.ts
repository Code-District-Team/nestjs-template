import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";
// import { Branding } from 'src/modules/branding/entities/branding.entity';
import { Branding } from '../../branding/entities/branding.entity';

@Entity({ name: 'tenants' })
export class Tenant extends BaseEntity  {
  @ApiProperty({ example: '1', description: 'Unique identifier', type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Company Name', type: String })
  @Column({ name: 'company_name', type: 'varchar', length: 255, nullable: true, unique: true, })
  companyName: string;

  @ApiProperty({ example: 'Company Website', type: String })
  @Column({ name: 'company_website', type: 'varchar', length: 255, nullable: true, })
  companyWebsite: string;

  @ApiProperty({ example: 'Company Email', type: String })
  @Column({ name: 'company_email', type: 'varchar', length: 255, nullable: true, unique: true, })
  companyEmail: string;

  @ApiProperty({ example: 'Company Phone', type: String })
  @Column({ name: 'stripe_customer_id', type: 'varchar', length: 255, nullable: true, })
  stripeCustomerId: string;

  @ApiProperty({ example: 'Company Phone', type: Boolean })
  @Column({ name: 'is_payment_method_attached', type: 'boolean', default: false, })
  isPaymentMethodAttached: boolean;

  @ApiProperty({ type: String })
  @Column({ name: 'branding_id', type: 'string', })
  brandingId: string;

  @ApiProperty({ type: Branding })
  @OneToOne(() => Branding)
  @JoinColumn({ name: 'branding_id' })
  branding: Branding;

  @ApiProperty({ example: 'Company Phone', type: Date })
  @Column({ name: 'created_at', type: 'timestamp', default: 'now()', })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: 'now()', })
  updatedAt: Date;
}
