import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Role-Permissions')
@ApiBearerAuth('JWT-auth')
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) { }

  @Post()
  async create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    try {
      const results = await this.rolePermissionsService.create(createRolePermissionDto.roleId, createRolePermissionDto.permissionIds);
      return results;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll() {
    return this.rolePermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolePermissionsService.findOne(id);
  }

  @Delete(':role-id/:permission-ids') // role_id and comma separated permission_ids
  remove(@Param('role-id') roleId: string, @Param('permission-ids') permissionIds: string) {
    return this.rolePermissionsService.remove(roleId, permissionIds.split(','));
  }
}
