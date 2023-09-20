import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { RolePermissionsController } from './role-permissions.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "../roles/entities/role.entity";
import { Permission } from "../permissions/entities/permission.entity";
import { RolePermission } from "./entities/role-permission.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission])],
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService]
})
export class RolePermissionsModule {
}
