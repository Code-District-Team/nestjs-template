import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { UserRepository } from "src/modules/users/user.repository";
import { constants } from "../modules/auth/constants";

export let ORGANIZATION_ID = null;

export function setOrganizationId(organizationId) {
  ORGANIZATION_ID = organizationId;
}
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log("I am in Private Middleware");
    let domainPrefix;
    let user;
    let organizationId;
    const { rawHeaders, headers } = req;
    const token = headers.authorization?.split(" ");
    const UrlHostArray = headers.host?.split(".");
    if (UrlHostArray?.length > 1) {
      domainPrefix = UrlHostArray[0];
    }
    if (token) {
      const decoded: any = jwt_decode(token[1]);
      const email = decoded.email;
      user = await this.userRepository.findOne({ email });
      organizationId = user?.organizationId;
      if (!user) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    } else {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    if (
      (user.organization && user.organization.domainPrefix.toLowerCase() == domainPrefix.toLowerCase()) ||
      user.type == constants.SuperAdminTypeName
    ) {
      ORGANIZATION_ID = organizationId;
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

export const OrgId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.body.organizationId;
});
