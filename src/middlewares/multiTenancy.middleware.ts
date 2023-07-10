import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MultiTenancyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isMultiTenancyEnabled = process.env.IS_MULTI_TENANT; // Example: Set it to true or false based on your configuration
    console.log('Is multi tenancy enabled', isMultiTenancyEnabled);
    if (isMultiTenancyEnabled) {
      const tenantId = req.headers['tenantId'] as string;

      req['tenantId'] = tenantId;
    }

    next();
  }
}
