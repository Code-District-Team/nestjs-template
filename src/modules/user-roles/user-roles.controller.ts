import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("User-Roles")
@ApiBearerAuth('JWT-auth')
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {
  }

  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRolesService.create(createUserRoleDto);
  }

  @Get()
  findAll() {
    return this.userRolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userRolesService.findOne(id);
  }

  @Delete(':userId/:roleId')
  async remove(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    const deleteResult = await this.userRolesService.removeRole(userId, roleId);
    if (deleteResult.affected)
      return { message: `Role removed` };
    throw new NotFoundException("Either user with given id does not exist or has no role");
  }

  @Delete(':userId')
  async removeAll(@Param('userId') id: string) {
    const deleteResult = await this.userRolesService.removeAllRoles(id);
    if (deleteResult.affected)
      return { message: `Total of ${deleteResult.affected} roles removed` };
    throw new NotFoundException(`Either user with given id does not exist or has no roles`)
  }
}
