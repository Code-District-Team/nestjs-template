import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus, Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/common/enums/role.enum';
import { User } from "../modules/users/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<RoleEnum[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!allowedRoles || !user.roles)
      throw new HttpException('roles not defined', HttpStatus.BAD_REQUEST);
    const roles = user.roles.map((role) => role.name);
    let rolesExists = false;
    roles.forEach((role) => {
      allowedRoles.forEach((allowedRole) => {
        if (role === allowedRole) {
          rolesExists = true;
          return;
        }
      });
    });
    if (!rolesExists) {
      throw new UnauthorizedException('Invalid Permission or Role');
    }
    return true;
  }
}
