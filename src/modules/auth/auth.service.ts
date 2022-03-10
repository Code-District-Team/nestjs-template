import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { v4 } from "uuid";
import { MailService } from "../mail/mail.service";
import { OrganizationRepository } from "../organization/organization.repository";
import { LoginDto, UserDto } from "../users/dto/user.dto";
import { UserRepository } from "../users/user.repository";
import { jwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(OrganizationRepository)
    private organizationRepository: OrganizationRepository
  ) {}

  async signUp(userDto: UserDto): Promise<void> {
    const userOrganization = await this.organizationRepository.getByDomainPrefix(userDto.domainPrefix);
    return this.userRepository.signUp(userDto, userOrganization);
  }
  async signIn(userDto: LoginDto): Promise<object> {
    const user = await this.userRepository.validateUserPassword(userDto);
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
      organizationNo: user?.organization?.id,
    };

    return response;
  }
  async changePassword(oldPassword: string, newPassword: string, user: any): Promise<string> {
    return await this.userRepository.changePasswordUser(oldPassword, newPassword, user);
  }

  async forgetPassword(email) {
    const user = await this.userRepository.findOne(
      { email },
      { select: ["id", "email", "password", "salt", "firstName", "lastName", "type", "forgetPasswordToken", "expires"] }
    );
    if (!user) return "success";
    //creating new token
    user.forgetPasswordToken = v4();
    user.expires = moment().add(10, "minutes").unix();
    await user.save();
    return await this.mailService.sendForgetPassword(user, user.forgetPasswordToken);
  }
  async resetPassword(password, token) {
    return await this.userRepository.resetPassword(token, password);
  }
  async loginAs(orgId: number) {
    const user = await this.userRepository.getOrgUserByOrgId(orgId);
    if (!user) {
      throw new HttpException("Invalid Organization Id", HttpStatus.NOT_FOUND);
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
      organizationNo: user?.organization?.id,
    };

    return response;
  }
}
