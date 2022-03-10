
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { constants } from 'src/modules/auth/constants';
import { UserRepository } from '../modules/users/user.repository';

@Injectable()
export class IsSuperAdmin implements CanActivate {
    constructor(@InjectRepository(UserRepository)
    private userRepository: UserRepository,) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        if(request.user.type==constants.SuperAdminTypeName)
return true;
else throw new ForbiddenException("Super Admin Unauthorized")
    }
}