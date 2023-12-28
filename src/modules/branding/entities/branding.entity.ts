import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'brandings' })
export class Branding extends BaseEntity  {
  @ApiProperty({ example: '1', description: 'Unique identifier', type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Primary Color', type: String })
  @Column({ name: 'primary_color', type: 'varchar', length: 255, nullable: true })
  primaryColor: string;

  @ApiProperty({ example: 'Secondary Color', type: String })
  @Column({ name: 'secondary_color', type: 'varchar', length: 255, nullable: true, })
  secondaryColor: string;

  @ApiProperty({ example: 'Foreground Text Color', type: String })
  @Column({ name: 'foreground_text_color', type: 'varchar', length: 255, nullable: true, })
  foregroundTextColor: string;

  @ApiProperty({ example: 'Created at', type: Date })
  @Column({ name: 'created_at', type: 'timestamp', default: 'now()', })
  createdAt: Date;

  @ApiProperty({ example: 'Updated at', type: Date })
  @Column({ name: 'updated_at', type: 'timestamp', default: 'now()', })
  updatedAt: Date;
}
