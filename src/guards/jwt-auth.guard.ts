import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from 'src/common/enums/role.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
