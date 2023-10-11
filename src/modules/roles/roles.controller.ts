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

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {
  }

  // @Roles(RoleEnum.SUPER_ADMIN)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const createResult = await this.rolesService.create(createRoleDto);
    if (createResult) return createResult;
    throw new BadRequestException("Please check if role is unique and permission ids are valid");
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const updateResult = await this.rolesService.update(id, updateRoleDto);
    if (updateResult)
      return updateResult;
    throw new NotFoundException('Role or permissions don\'t exist');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteResult = await this.rolesService.remove(id);
    if (deleteResult.affected)
      return { message: 'Delete success' };
    throw new NotFoundException('Role not found');
  }
}
