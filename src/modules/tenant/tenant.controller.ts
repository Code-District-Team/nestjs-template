import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { TenantService } from "./tenant.service";

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {
  }


  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.tenantService.findOne(id);
  }
}
