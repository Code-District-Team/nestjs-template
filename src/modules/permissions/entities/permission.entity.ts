import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("permissions")
export class Permission {

  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }

  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String })
  @Column({ length: 255, unique: true })
  name: string;

  @ApiProperty({ type: String })
  @Column({ length: 255 })
  code: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
