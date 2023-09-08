import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CrudValidationGroups } from "@nestjsx/crud";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength } from "class-validator";

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Hero {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @IsNotEmpty({ groups: [CREATE] })
  @IsInt({ groups: [CREATE, UPDATE] })
  @Max(100, { groups: [CREATE, UPDATE] })
  @Column({ type: "int", nullable: false })
  power: number;
}