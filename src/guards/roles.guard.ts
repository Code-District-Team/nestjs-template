import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/common/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<RoleEnum[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!allowedRoles || !user.role)
      throw new HttpException('roles not defined', HttpStatus.BAD_REQUEST);
    const {
      role: { name: userRole },
    } = user;

    if (!allowedRoles.includes(userRole)) {
      throw new UnauthorizedException('Invalid Permission or Role');
    }

    return true;
  }
}
