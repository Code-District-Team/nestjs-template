import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {
  }

  @Post()
  async create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    const results = await this.rolePermissionsService.create(createRolePermissionDto);
    if (!results) throw new BadRequestException('Role or permission not found');
    return results;
  }

  @Get()
  findAll() {
    return this.rolePermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolePermissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return {
      message: `We can't update a role permission. But you can delete it and create a new one.`
    }
  }

  @Delete(':role-id/:permission-ids') // role_id and comma separated permission_ids
  remove(@Param('role-id') roleId: string, @Param('permission-ids') permissionIds: string) {
    return this.rolePermissionsService.remove(roleId, permissionIds.split(','));
  }
}
