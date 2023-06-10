import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CustomPipe } from 'src/pipe/customValidation.pipe';
import { RoleEnum } from '../../common/enums/role.enum';
import { Role } from '../roles/entities/role.entity';
import { EditContactDto } from './dto/editContactDetails.dto';
import { EditUserDto } from './dto/editUser.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { EditUserRoleDto } from './dto/editUserRole.dto';
import { GetUserRequestDto } from './dto/getUsers.dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/roles')
  @UseGuards(JwtAuthGuard)
  async getRoles() {
    try {
      return this.userService.findAllRoles();
    } catch (err) {
      console.log(err);
    }
  }

  @Get('/get-users')
  @UseGuards(JwtAuthGuard)
  getUsers(@Query() getUsersDto: GetUserRequestDto) {
    return this.userService.getAllUsers(getUsersDto);
  }

  @Patch('/update-role')
  @Roles(RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateRole(@Body() editRoleDto: EditUserRoleDto) {
    return this.userService.updateUserRole(editRoleDto);
  }

  @Post('/update-profile')
  @Roles(RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(CustomPipe)
  updateProfile(@Req() request, @Body() userProfileDto: EditUserDto) {
    // if (request.user.type != constants.OrgUserTypeName)
    //   throw new HttpException("Not a Org User", HttpStatus.BAD_REQUEST);'

    return this.userService.updateProfile(request.user, userProfileDto);
  }

  @Post('/edit-contact-details')
  @Roles(RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateUserContact(
    @Req() request,
    @Body(CustomPipe) editContactDto: EditContactDto,
  ) {
    return this.userService.updateContact(request.user, editContactDto);
  }

  @Post('/invite-user')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async forgetPassword(
    @Body(ValidationPipe) inviteUserDto: InviteUserDto,
  ): Promise<{ message: any }> {
    const status = await this.userService.inviteUser(
      inviteUserDto.email,
      inviteUserDto.roleId,
    );
    return { message: status };
  }
}
