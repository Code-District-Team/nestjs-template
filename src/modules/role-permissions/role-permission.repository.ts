// role-permission.repository.ts
import { EntityTarget, EntityManager, Repository, In } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { DeleteResult } from 'typeorm';

export class RolePermissionRepository extends Repository<RolePermission> {
    constructor(
        public entity: EntityTarget<RolePermission>,
        public manager: EntityManager
    ) {
        super(entity, manager);
    }

    async addRolePermission(roleId: string, permissionIds: string[]): Promise<RolePermission[]> {
        const role = await this.manager.findOne(Role, { where: { id: roleId } });
        if (!role) {
            throw new Error('Role not found');
        }

        const permissions = await this.manager.findByIds(Permission, permissionIds);
        if (permissions.length !== permissionIds.length) {
            throw new Error('One or more permissions not found');
        }

        const rolePermissions = permissions.map(permission => {
            let rolePermission = new RolePermission();
            rolePermission.roleId = roleId;
            rolePermission.permissionId = permission.id;
            rolePermission.role = role;
            rolePermission.permission = permission;
            return rolePermission;
        });

        return this.manager.save(rolePermissions);
    }

    async findAllRolePermissions(): Promise<RolePermission[]> {
        return this.manager.find(RolePermission, { relations: ['role', 'permission'] });
    }

    async findOneRolePermission(id: string): Promise<RolePermission> {
        return this.manager.findOne(RolePermission, { where: { id }, relations: ['role', 'permission'] });
    }

    async removeRolePermission(roleId: string, permissionIds: string[]): Promise<DeleteResult> {
        return this.manager.delete(RolePermission, { roleId, permissionId: In(permissionIds) });
    }
}
