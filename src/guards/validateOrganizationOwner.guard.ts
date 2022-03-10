
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { constants } from 'src/modules/auth/constants';
import { UserRepository } from '../modules/users/user.repository';

@Injectable()
export class ValidateOrganizationOwner implements CanActivate {
    constructor(@InjectRepository(UserRepository)
    private userRepository: UserRepository,) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const userExist = await this.userRepository.findOne({organizationId:request.body.organizationId})
        if(!userExist)  throw new ForbiddenException("User not exist")
        else{
            if(userExist.organizationId==request.body.organizationId&&userExist.type==constants.OrgUserTypeName) return true
            else throw new ForbiddenException("Not an Organization User")

        }
        
    }
}