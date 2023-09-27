import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEnum, RoleEnum } from 'src/common/enums/role.enum';
import { User } from "../modules/users/entities/user.entity";
import { Role } from "../modules/roles/entities/role.entity";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const rolesPermissions = this.reflector.get<{ roles: RoleEnum[], permissions: PermissionEnum[] }>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user.roles || !user.roles || !user.roles.length)
      throw new HttpException('roles not defined', HttpStatus.UNAUTHORIZED);

    const allowedRoles = rolesPermissions.roles;
    const allowedPermissions = rolesPermissions.permissions;

    const rolesHash = new Map<string, Role>();
    user.roles.forEach(role => {
      rolesHash.set(role.name, role);
    });

    let hasRole = false;
    let hasPermission = false;
    allowedRoles.forEach(role => {
      if (rolesHash.has(role)) {
        hasRole = true;
        rolesHash.get(role).permissions.some(permission => {
          allowedPermissions.forEach(allowedPermission => {
            if (permission.name === String(allowedPermission)) {
              hasPermission = true;
              return true;
            }
          });
        });
      }
      if (hasRole && hasPermission) return true;
    });
    if (!hasRole) {
      throw new UnauthorizedException('You do not have role to access this resource');
    }
    if (!hasPermission) {
      throw new UnauthorizedException('You do not have permission to access this resource');
    }

    return true;
  }
}
