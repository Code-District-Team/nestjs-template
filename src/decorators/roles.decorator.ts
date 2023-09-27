import { SetMetadata } from '@nestjs/common';
import { PermissionEnum, RoleEnum } from '../common/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);

export const RolesPermissions = (roles: RoleEnum[], permissions: PermissionEnum[]) => SetMetadata(ROLES_KEY, {
  roles,
  permissions
});