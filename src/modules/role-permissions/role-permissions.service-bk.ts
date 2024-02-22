import { Injectable } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../roles/entities/role.entity";
import { DeleteResult, In, Repository } from "typeorm";
import { Permission } from "../permissions/entities/permission.entity";
import { RolePermission } from "./entities/role-permission.entity";

@Injectable()
export class RolePermissionsService {

  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
              @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
              @InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>) {
  }

  async create(createRolePermissionDto: CreateRolePermissionDto) { //: Promise<RolePermission> {
    const [role, permissions] = await Promise.all([
      this.roleRepository.findOneBy({ id: createRolePermissionDto.roleId }),
      this.permissionRepository.find({ where: { id: In(createRolePermissionDto.permissionIds) } })
    ]);
    if (!role || !permissions || permissions.length !== createRolePermissionDto.permissionIds.length) return null;

    const roles = new Role();
    roles.id = createRolePermissionDto.roleId;
    role.permissions = permissions;
    return await this.roleRepository.save(role);
  }

  findAll(): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find();
  }

  findOne(id: string): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find({ where: { roleId: id }, relations: ['role', 'permission'] });
  }

  remove(roleId: string, permissionId: string[]): Promise<DeleteResult> {
    return this.rolePermissionRepository.delete({ roleId, permissionId: In(permissionId) });
  }
}
