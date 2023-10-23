import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { TenantService } from "./tenant.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Tenant } from "./entities/tenant.entity";
import { User } from "../users/entities/user.entity";

@ApiTags('Tenant')
@ApiBearerAuth('JWT-auth')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {
  }


  @ApiOperation({ summary: "list all tenants" })
  @ApiResponse({ status: 200, description: "Return all tenants", type: [Tenant] })
  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @ApiOperation({ summary: "Get users along with their tenants" })
  @ApiParam({ name: 'id', type: String, description: "uuid" })
  @ApiResponse({ status: 200, description: "Get users along with their tenants", type: [User] })
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.tenantService.findOne(id);
  }
}
