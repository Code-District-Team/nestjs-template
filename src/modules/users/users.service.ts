import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { EditUserDto } from './dto/editUser.dto';

import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';
import { v4 } from 'uuid';
import { User } from './entities/user.entity';
import { LoginDto } from '../auth/dto/loginUser.dto';
import { Repository } from 'typeorm';
import { deleteObjProps, updateObjProps } from 'src/generalUtils/helper';
import { EditContactDto } from './dto/editContactDetails.dto';
import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from 'src/common/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { StatusEnum } from '../../common/enums/status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async updateProfile(user, userDto: EditUserDto) {
    const userData = await this.userRepository.findOneBy({ id: userDto.id });

    if (!userData)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    if (userData.id !== user.id) {
      throw new HttpException('Invalid User', HttpStatus.BAD_REQUEST);
    }

    updateObjProps(userData, userDto);

    try {
      const updatedUser = await this.userRepository.save(userData);
      const { password, ...upadtedUserWithoutPassword } = updatedUser;

      return {
        ...upadtedUserWithoutPassword,
        name: updatedUser.lastName
          ? updatedUser.firstName + ' ' + updatedUser.lastName
          : updatedUser.firstName,
      };
    } catch (err) {
      throw new HttpException(
        `Error updating database ${err}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateContact(user: User, editContactDto: EditContactDto) {
    return await this.UpdateUserData(user, editContactDto);
  }

  async getUser(userId) {
    let user = await this.userRepository.findOneBy({ id: userId });
    // delete user.organization;

    return user;
  }

  async getUserByEmail(email: string) {
    let user = await this.userRepository.findOne({
      where: { email },
      relations: {
        role: true,
      },
    });

    return user;
  }

  async saveUser(user: User) {
    try {
      await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException('Error saving user data', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserwithUuid(userId, user) {
    if (userId !== user.id)
      throw new HttpException(
        'Invalid User Route or user does not exist',
        HttpStatus.FORBIDDEN,
      );
    let userData = await this.userRepository.findOneBy({ id: userId });
    return {
      ...userData,
      name: userData.lastName
        ? userData.firstName + ' ' + userData.lastName
        : userData.firstName,
    };
  }

  async getAllUsers(filters) {
    let user = await this.userRepository.createQueryBuilder('user');

    if (filters.pageNumber && filters.recordsPerPage) {
      filters.pageNumber -= 1;
      let skip = +filters.pageNumber * +filters.recordsPerPage;
      user = user.skip(skip).take(filters.recordsPerPage);
    }

    return await user.orderBy('user.id', 'DESC').getMany();
  }

  async findAll(pageNumber, recordsPerPage) {
    let resData;
    if (pageNumber && recordsPerPage) {
      pageNumber -= 1;
      let skip = +pageNumber * +recordsPerPage;
      const [result, total] = await this.userRepository.findAndCount({
        order: {
          id: 'DESC',
        },
        skip: skip,
        take: recordsPerPage,
      });
      resData = {
        data: result,
        total,
      };
    } else {
      const [result, total] = await this.userRepository.findAndCount({
        order: {
          id: 'DESC',
        },
      });
      resData = {
        data: result,
        total,
      };
    }
    resData.data = resData.data.map((user) => {
      return user;
    });
    return resData;
  }

  async signUp(userdto: CreateUserDto) {
    const { firstName, lastName, email, password, phoneNumber } = userdto;
    const user = await this.userRepository.findOneBy({ email });

    const isPendingUser = user && user.status === StatusEnum.PENDING;

    if (user && user.status === StatusEnum.ACTIVE) {
      throw new HttpException('Email Already Exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = isPendingUser ? user : new User();

    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    newUser.mobilePhone = phoneNumber;
    if (!isPendingUser) {
      newUser.email = email;
      newUser.role = await this.roleRepository.findOneBy({
        name: RoleEnum.CLIENT,
      });
    }
    newUser.status = StatusEnum.ACTIVE;

    try {
      isPendingUser
        ? await this.userRepository.upsert(newUser, ['email'])
        : await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new HttpException(
        `Error saving database ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByEmail(email) {
    return this.userRepository.findOneBy({ email });
  }

  async validateUser(userDto: LoginDto): Promise<User> {
    const { email, password } = userDto;
    const user = await this.userRepository.findOneBy({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    } else {
      throw new HttpException(
        'Invalid User Credentials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, bcrypt.genSaltSync());
  }

  async changePasswordUser(
    oldPassword,
    newPassword,
    user: any,
  ): Promise<string> {
    const dbUser = await this.userRepository.findOneBy({ id: user.id });
    if (dbUser && (await bcrypt.compare(oldPassword, dbUser.password))) {
      newPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt());
      dbUser.password = newPassword;
      await this.userRepository.save(dbUser);
      return 'success';
    } else {
      throw new HttpException(
        'Invalid User Credentials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async forgetPasswordUser(email: string): Promise<User> {
    const dbUser = await this.userRepository.findOneBy({ email });
    if (!dbUser) throw new NotFoundException('Email doest not Exists');
    dbUser.forgetPasswordToken = v4();
    dbUser.forgetPasswordTokenExpires = moment().add(10, 'minutes').unix();
    await this.userRepository.save(dbUser);
    return dbUser;
  }

  async resetPassword(token, password) {
    const dbUser = await this.userRepository.findOne({
      where: {
        forgetPasswordToken: token
      },
      select: [
        'id',
        'forgetPasswordToken',
        'forgetPasswordTokenExpires',
        'password',
      ]
    });
    if (dbUser) {
      if(moment().unix() > dbUser.forgetPasswordTokenExpires) 
        throw new HttpException('Token expired', HttpStatus.FORBIDDEN);
      password = await this.hashPassword(password);
      dbUser.password = password;
      dbUser.forgetPasswordToken = null;
      dbUser.forgetPasswordTokenExpires = null;
      await this.userRepository.save(dbUser);
      return 'success';
    } else {
      throw new HttpException(
        'Invalid Token (User not found)',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async inviteUser(email, roleId): Promise<string> {
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new UnauthorizedException('Role Not Found');
    }

    const emailExists = await this.userRepository.findOneBy({ email });

    if (emailExists) {
      throw new HttpException('Email Already exists', HttpStatus.BAD_REQUEST);
    }

    const user = new User();
    user.email = email;
    user.role = role;
    const password = '123456';
    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    user.status = StatusEnum.PENDING;

    await this.userRepository.save(user);

    const token = await this.jwtService.sign({ email });

    return await this.mailService.sendUserInvite(user, token);
  }

  async deleteUser(userId) {
    const user = await this.userRepository.findOneBy({ id: userId });

    try {
      const res = await this.userRepository.softDelete({ id: userId });
      return 'User deleted';
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  private async UpdateUserData(user: User, dto: any) {
    const userData = await this.userRepository.findOneBy({ email: user.email });
    // user.email = profileDto.email;

    if (userData.id !== user.id) {
      throw new HttpException('Invalid User route', HttpStatus.BAD_REQUEST);
    }

    updateObjProps(userData, dto);

    try {
      const updatedUser = await this.userRepository.save(userData);

      deleteObjProps(updatedUser, []);

      return {
        ...updatedUser,
        name: user.lastName
          ? user.firstName + ' ' + user.lastName
          : user.firstName,
      };
    } catch (err) {
      throw new HttpException(
        `Error saving database ${err}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async findAllRoles(): Promise<Role[]> {
    try {
      return await this.roleRepository.find();
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
