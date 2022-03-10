import { Body, Controller, Param, Post, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IsSuperAdmin } from "src/guards/isSuperAdmin.guard";
import { ChangePasswordDto, ForgetPasswordDto, LoginDto, ResetPasswordDto, UserDto } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import { LoginAsDto } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  signUp(@Body(ValidationPipe) userDto: UserDto) {
    return this.authService.signUp(userDto);
  }

  @Post("/signin")
  signIn(@Body(ValidationPipe) userDto: LoginDto): Promise<object> {
    return this.authService.signIn(userDto);
  }

  @Post("/change-password")
  @UseGuards(AuthGuard())
  async changePassword(@Body(ValidationPipe) userDto: ChangePasswordDto, @Req() req): Promise<{ message: string }> {
    const status = await this.authService.changePassword(userDto.oldPassword, userDto.newPassword, req.user);
    return { message: status };
  }

  @Post("/test")
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req.user);
    console.log(req.body);
  }

  @Post("/forget-password")
  async forgetPassword(@Body(ValidationPipe) forgetPasswordDto: ForgetPasswordDto): Promise<{ message: any }> {
    const status = await this.authService.forgetPassword(forgetPasswordDto.email);
    return { message: status };
  }

  @Post("/reset-password/:token")
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
    @Param() param
  ): Promise<{ message: any }> {
    const status = await this.authService.resetPassword(resetPasswordDto.password, param.token);
    return { message: status };
  }

  @UseGuards(IsSuperAdmin)
  @UseGuards(AuthGuard())
  @Post("/login-as/:orgId")
  loginAs(@Param(ValidationPipe) param: LoginAsDto) {
    const { orgId } = param;
    return this.authService.loginAs(orgId);
  }
}
