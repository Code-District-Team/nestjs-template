import { Controller, Get, Post } from '@nestjs/common';
import { TenantService } from "./tenant.service";

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}


  @Post()
  create() {

  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }
}
