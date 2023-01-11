import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { v4 } from "uuid";
import { MailService } from "../mail/mail.service";
import { ContactUsDto, LoginDto, UserDto } from "../users/dto/user.dto";
import { UserRepository } from "../users/user.repository";
import { jwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async signUp(userDto: UserDto): Promise<object> {
    const name = userDto.firstName + " " + userDto.lastName;
    const res = await this.userRepository.signUp(userDto);
    if (res) {
      const email = res.email;
      const payload: jwtPayload = { email };
      const accessToken = await this.jwtService.sign(payload);
      delete res.password;
      delete res.salt;
      const response = {
        ...res,
        apiToken: accessToken,
        name: res.lastName ? res.firstName + " " + res.lastName : res.firstName,
      };
      return response;
    } else {
      throw new HttpException("User Not Created", HttpStatus.BAD_REQUEST);
    }
  }
  async signIn(userDto: LoginDto): Promise<object> {
    let user = await this.userRepository.validateUserPassword(userDto);
    if (!user) {
      throw new UnauthorizedException("Invalid Credentials");
    }
    const email = user.email;
    const payload: jwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    delete user.password;
    delete user.salt;

    const response = {
      ...user,
      apiToken: accessToken,
      name: user.lastName ? user.firstName + " " + user.lastName : user.firstName,
    };

    return response;
  }

  async refreshUser(userEmail): Promise<object> {
    const user = await this.userRepository.findOne(
      { email: userEmail },
      {
        select: [
          "id",
          "email",
          "password",
          "salt",
          "firstName",
          "lastName",
          "role",
          "subscriptionStatus",
          "uuid",
          "planId",
        ],
      }
    );
    if (!user) throw new NotFoundException("Email doest not Exists");

    const email = user.email;
    const payload: jwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    delete user.password;
    delete user.salt;
    const response = {
      ...user,
      apiToken: accessToken,
      name: user.lastName ? user.firstName + " " + user.lastName : user.firstName,
    };

    return response;
  }
  async changePassword(oldPassword: string, newPassword: string, user: any): Promise<string> {
    return await this.userRepository.changePasswordUser(oldPassword, newPassword, user);
  }

  async forgetPassword(email) {
    const user = await this.userRepository.findOne(
      { email },
      { select: ["id", "email", "password", "salt", "firstName", "lastName", "role", "forgetPasswordToken", "expires"] }
    );
    if (!user) throw new NotFoundException("Email doest not Exists");
    //creating new token
    user.forgetPasswordToken = v4();
    user.expires = moment().add(10, "minutes").unix();
    await user.save();
    return await this.mailService.sendForgetPassword(user, user.forgetPasswordToken);
  }
  async contactUs(contactUsDto: ContactUsDto) {
    return await this.mailService.sendContactUs(contactUsDto);
  }

  async resetPassword(password, token) {
    return await this.userRepository.resetPassword(token, password);
  }
}
