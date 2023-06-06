import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../users/dto/createUser.dto';

import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/loginUser.dto';
import { jwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async signUp(userDto: CreateUserDto): Promise<object> {
    const result = await this.userService.signUp(userDto);

    if (result) {
      const email = result.email;
      const payload: jwtPayload = { email };
      const accessToken = await this.jwtService.sign(payload);
      delete result.password;
      const response = {
        user: result,
        apiToken: accessToken,
      };
      return response;
    } else {
      throw new HttpException('User Not Created', HttpStatus.BAD_REQUEST);
    }
  }
  async signIn(userDto: LoginDto): Promise<object> {
    let user = await this.userService.validateUser(userDto);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload: jwtPayload = { email: user.email };
    const accessToken = await this.jwtService.sign(payload);
    const { password, ...userWithoutPassword } = user;

    const response = {
      user: {...userWithoutPassword,
        name: user.lastName
        ? user.firstName + ' ' + user.lastName
        : user.firstName
      },
      apiToken: accessToken,
    };

    return response;
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    user: User,
  ): Promise<string> {
    if (oldPassword === newPassword)
      throw new HttpException(
        'Old Password cannot be new password',
        HttpStatus.BAD_REQUEST,
      );

    if (user && bcrypt.compareSync(oldPassword, user.password)) {
      newPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync());

      user.password = newPassword;
      await this.userService.saveUser(user);
      return 'Succesfully Updated';
    } else {
      throw new HttpException(
        'Invalid User or invalid old password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgetPassword(email) {
    const user = await this.userService.forgetPasswordUser(email);
    if (!user) throw new NotFoundException('Email doest not Exists');
    return await this.mailService.sendForgetPassword(
      user,
      user.forgetPasswordToken,
    );
  }

  async resetPassword(password, token) {
    return await this.userService.resetPassword(token, password);
  }

  async decryptToken(token) {
    try {
      return this.jwtService.verify(token).email;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
