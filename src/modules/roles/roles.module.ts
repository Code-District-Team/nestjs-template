import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Permission } from "../permissions/entities/permission.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role])],
  providers: [RolesService],
  controllers: [RolesController]
})
export class RolesModule {
}
