import {
  Body,
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CustomPipe } from 'src/pipe/customValidation.pipe';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { LoginDto } from './dto/loginUser.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Sign up" })
  @ApiBody({ type: CreateUserDto })
  @Post('/signup')
  @UsePipes(CustomPipe)
  signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }

  @ApiOperation({ summary: "Sign in" })
  @ApiBody({ type: LoginDto })
  @Post('/signin')
  signIn(@Body(ValidationPipe) userDto: LoginDto): Promise<object> {
    return this.authService.signIn(userDto);
  }

  @ApiOperation({ summary: "Change password" })
  @ApiBody({ type: ChangePasswordDto })
  @Post('/change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body(ValidationPipe) userDto: ChangePasswordDto,
    @Req() req,
  ): Promise<{ message: string }> {
    const status = await this.authService.changePassword(
      userDto.oldPassword,
      userDto.newPassword,
      req.user,
    );
    return { message: status };
  }

  @ApiOperation({ summary: "Forget password" })
  @ApiBody({ type: ForgetPasswordDto })
  @Post('/forget-password')
  async forgetPassword(
    @Body(ValidationPipe) forgetPasswordDto: ForgetPasswordDto,
  ): Promise<{ message: any }> {
    const status = await this.authService.forgetPassword(
      forgetPasswordDto.email,
    );
    return { message: status };
  }

  @ApiOperation({ summary: "Reset password" })
  @ApiParam({ name: 'token', type: String, description: "uuid" })
  @ApiBody({ type: ResetPasswordDto })
  @Post('/reset-password/:token')
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
    @Param() param,
  ): Promise<{ message: any }> {
    const status = await this.authService.resetPassword(
      resetPasswordDto.password,
      param.token,
    );

    return { message: status };
  }

  @ApiOperation({ summary: "Verify token" })
  @ApiQuery({ name: 'token', type: String })
  @Get('verify-token')
  @UseGuards(JwtAuthGuard)
  async verifyToken(
    @Query('token') encryptedEmail: string,
  ): Promise<{ email: string }> {
    const decryptedEmail = await this.authService.decryptToken(encryptedEmail);
    return { email: decryptedEmail };
  }
}
