import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get, InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CustomPipe } from 'src/pipe/customValidation.pipe';
import { RoleEnum } from '../../common/enums/role.enum';
import { EditUserDto } from './dto/editUser.dto';
import { InviteUserDto } from './dto/inviteUser.dto';
import { EditUserRoleDto } from './dto/editUserRole.dto';
import { GetUserRequestDto2 } from './dto/getUsers.dto';
import { UserIdDto } from './dto/userId.dto';

import { UsersService } from './users.service';
import { createSignedLink } from 'src/generalUtils/aws-config';
import { FileInterceptor } from "@nestjs/platform-express";
import * as Buffer from "buffer";
import { multerOptions } from "../../generalUtils/helper";

const bucketName = process.env.AWS_BUCKET;

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {
  }

  @Get('/roles')
  @UseGuards(JwtAuthGuard)
  async getRoles() {
    try {
      return this.userService.findAllRoles();
    } catch (err) {
      console.log(err);
    }
  }


  @Get('/get-all')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUsers(@Query() getUsersDto: GetUserRequestDto2) {
    return this.userService.getAllUsers(getUsersDto);
  }

  @Get('/me')
  @Roles(RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUser(@Req() request) {
    return this.userService.getUser(request.user.id);
  }

  @Get('/presignedUrl')
  @UseGuards(JwtAuthGuard)
  getPreSignedUrl() {
    return createSignedLink(bucketName, 'Test Folder/test.txt', 'getObject');
  }

  @Get('/upload-picture')
  // @UseGuards(JwtAuthGuard)
  getUploadPictureUrl(@Req() request, @Param() param) {
    return createSignedLink(
      bucketName,
      // `Test Folder/${request.user.id}/${param.fileName}`,
      `Test Folder/${param.fileName}`,
      'putObject',
    );
  }

  @Get('/:id')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getUserById(@Param() param: UserIdDto) {
    const { id } = param;
    return this.userService.getUser(id);
  }

  @Put('/update-profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(CustomPipe)
  updateProfile(@Req() request, @Body() userProfileDto: EditUserDto) {
    return this.userService.updateProfile(request.user, userProfileDto);
  }

  @Patch('/update-role')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateRole(@Body() editRoleDto: EditUserRoleDto) {
    return this.userService.updateUserRole(editRoleDto);
  }

  @Delete('/delete-user')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  deleteUser(@Query('userId') userId: UserIdDto) {
    return this.userService.deleteUser(userId);
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

  // upload picture
  @Post('/upload-picture')
  @Roles(RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadPicture(@Req() request, @UploadedFile() file) {
    if (request.fileValidationError) {
      throw new BadRequestException(request.fileValidationError);
    }
    if (!file)
      throw new BadRequestException("Couldn't update profile picture, only image of size 5MB is allowed");
    const updateResult = await this.userService.updateProfileURL(request.user.id, file.path);
    if (updateResult.affected) return file;
    throw new InternalServerErrorException("Something bad happened while updating profile picture");
  }
}
