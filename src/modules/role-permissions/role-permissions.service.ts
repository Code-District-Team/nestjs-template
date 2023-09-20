import { Injectable } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../roles/entities/role.entity";
import { DeleteResult, Repository } from "typeorm";
import { Permission } from "../permissions/entities/permission.entity";
import { RolePermission } from "./entities/role-permission.entity";

@Injectable()
export class RolePermissionsService {

  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
              @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
              @InjectRepository(RolePermission) private readonly rolePermissionRepository: Repository<RolePermission>) {
  }

  async create(createRolePermissionDto: CreateRolePermissionDto): Promise<RolePermission> {
    const [role, permission] = await Promise.all([
      this.roleRepository.findOneBy({ id: createRolePermissionDto.roleId }),
      this.permissionRepository.findOneBy({ id: createRolePermissionDto.permissionId })
    ]);
    // go back to the controller and add a try catch block to handle the error
    if (!role || !permission) return null;
    const rolePermission = this.rolePermissionRepository.create({
      roleId: role.id,
      permissionId: permission.id
    });
    return this.rolePermissionRepository.save(rolePermission);
  }

  findAll(): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find({ relations: ['role', 'permission'] });
  }

  findOne(id: string): Promise<RolePermission[]> {
    return this.rolePermissionRepository.find({ where: { roleId: id }, relations: ['role', 'permission'] });
  }

  remove(roleId: string, permissionId: string): Promise<DeleteResult> {
    return this.rolePermissionRepository.delete({ roleId, permissionId });
  }
}
