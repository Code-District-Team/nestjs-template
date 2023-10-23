import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/createRole.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "./entities/role.entity";

@ApiTags('Roles')
@ApiBearerAuth('JWT-auth')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {
  }

  @ApiOperation({ summary: "Create a new role" })
  @ApiBody({ type: CreateRoleDto })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const createResult = await this.rolesService.create(createRoleDto);
    if (createResult) return createResult;
    throw new BadRequestException("Please check if role is unique and permission ids are valid");
  }

  @ApiOperation({ summary: "Get all roles" })
  @ApiResponse({ status: 200, description: "Return all roles", type: [Role] })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: "Get a role by id" })
  @ApiParam({ name: 'id', type: String, description: "uuid" })
  @ApiResponse({ status: 200, description: "Return a role by id", type: Role })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @ApiOperation({ summary: "Update a role by id" })
  @ApiParam({ name: 'id', type: String, description: "uuid" })
  @ApiBody({ type: UpdateRoleDto })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const updateResult = await this.rolesService.update(id, updateRoleDto);
    if (updateResult)
      return updateResult;
    throw new NotFoundException('Role or permissions don\'t exist');
  }

  @ApiOperation({ summary: "Delete a role by id" })
  @ApiParam({ name: 'id', type: String, description: "uuid" })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteResult = await this.rolesService.remove(id);
    if (deleteResult.affected)
      return { message: 'Delete success' };
    throw new NotFoundException('Role not found');
  }
}
