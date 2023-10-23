import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Permission } from "./entities/permission.entity";

@ApiTags('Permission')
@ApiBearerAuth('JWT-auth')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {
  }

  @ApiOperation({ summary: "Create a new permission" })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({ status: 201, description: "Return a newly created permission", type: Permission })
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @ApiOperation({ summary: "Get all permissions" })
  @ApiResponse({ status: 200, description: "Return all permissions", type: [Permission] })
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @ApiOperation({ summary: "Get a permission by id" })
  @ApiParam({ name: 'id', type: String, description: "uuid" })
  @ApiResponse({ status: 200, description: "Return a permission by id", type: Permission })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @ApiOperation({ summary: "Update a permission by id" })
  @ApiParam({ name: 'id', type: String, description: "uuid" })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({ status: 200, description: "Return an updated permission", type: Permission })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @ApiOperation({ summary: "Delete a permission by id" })
  @ApiParam({ name: 'id', type: String, description: "uuid" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
