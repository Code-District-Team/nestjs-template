// role-permissions.service.ts
import { Injectable } from '@nestjs/common';
import { RolePermissionRepository } from './role-permission.repository';
import { RolePermission } from './entities/role-permission.entity';
import { DeleteResult, EntityManager } from 'typeorm';

@Injectable()
export class RolePermissionsService {
  private rolePermissionRepository: RolePermissionRepository;

  constructor(private manager: EntityManager) {
    this.rolePermissionRepository = new RolePermissionRepository(RolePermission, manager);
  }

  create(roleId: string, permissionIds: string[]): Promise<RolePermission[]> {
    return this.rolePermissionRepository.addRolePermission(roleId, permissionIds);
  }

  findAll(): Promise<RolePermission[]> {
    return this.rolePermissionRepository.findAllRolePermissions();
  }

  findOne(id: string): Promise<RolePermission> {
    return this.rolePermissionRepository.findOneRolePermission(id);
  }

  remove(roleId: string, permissionIds: string[]): Promise<DeleteResult> {
    return this.rolePermissionRepository.removeRolePermission(roleId, permissionIds);
  }
}
