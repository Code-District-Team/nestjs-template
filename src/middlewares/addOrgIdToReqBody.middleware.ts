import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { OrganizationRepository } from "src/modules/organization/organization.repository";
import { setOrganizationId } from "./tenant.middleware";

@Injectable()
export class AddOrgIdToReqBody implements NestMiddleware {
  constructor(
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log("I am in Public Middleware");
    let domainPrefix;
    let organization;
    let organizationId;
    const { rawHeaders, headers } = req;
    const UrlHostArray = headers.host?.split(".");

    if (UrlHostArray?.length > 1) {
      domainPrefix = UrlHostArray[0];
      organization = await this.organizationRepository.findOne({ domainPrefix: domainPrefix });
      if (!organization) throw new BadRequestException("Invalid Domain Prefix");
      organizationId = organization?.id;
      setOrganizationId(organizationId);
      req.body = {
        ...req.body,
        organizationId,
      };
      next();
    } else {
      throw new BadRequestException("Invalid Domain Prefix");
    }
  }
}
