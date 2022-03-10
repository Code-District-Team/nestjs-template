
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { OrganizationRepository } from '../modules/organization/organization.repository';

@Injectable()
export class DoesOrganizationExist implements CanActivate {
    constructor(@InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository,) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const organizationExist = await this.organizationRepository.findOneByDomainPrefix(request.body.domainPrefix);
        if (organizationExist) {
            throw new ForbiddenException('This doamin prefix already exist');
        }
        return true;
    }
}