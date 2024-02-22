import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateTenantDto, CreateUserDto } from './dto/createUser.dto';
import { EditUserDto } from './dto/editUser.dto';

import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';
import { v4 } from 'uuid';
import { User } from './entities/user.entity';
import { LoginDto } from '../auth/dto/loginUser.dto';
import { DataSource, ILike, In, Not, Repository, UpdateResult } from 'typeorm';
import { deleteObjProps, updateObjProps } from 'src/generalUtils/helper';
import { Role } from '../roles/entities/role.entity';
import { RoleEnum } from 'src/common/enums/role.enum';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { StatusEnum } from '../../common/enums/status.enum';
import { EditUserRoleDto } from './dto/editUserRole.dto';
import { createSignedLink } from 'src/generalUtils/aws-config';
import { AssignRolesDto } from "./dto/assign-roles.dto";
import { join } from "path";
import * as fs from "fs";
import { Tenant } from "../tenant/entities/tenant.entity";
import { GetUserRequestDto2 } from "./dto/getUsers.dto";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";
import { StripeService } from "../stripe/stripe.service";
import { BrandingService } from '../branding/branding.service';

const bucketName = process.env.AWS_BUCKET;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private mailService: MailService,
    private brandingService: BrandingService,
    @InjectDataSource()
    private dataSource: DataSource,
    private stripeService: StripeService,
  ) {
  }

  async updateProfile(user, userDto: EditUserDto) {
    const userData = await this.userRepository.findOneBy({ id: userDto.id });

    if (!userData)
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    if (userData.id !== user.id) {
      throw new HttpException('Invalid User', HttpStatus.BAD_REQUEST);
    }

    Object.keys(userDto).forEach((obj) => {
      userData[obj] = userDto[obj];
    });

    try {
      const updatedUser = await this.userRepository.save(userData);
      const { password, ...updatedUserWithoutPassword } = updatedUser;

      return {
        ...updatedUserWithoutPassword,
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

  async updateUserRole(editRoleDto: EditUserRoleDto) {
    const { email, roleId } = editRoleDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (!role) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }

    user.roles = [role];
    try {
      await this.userRepository.save(user);
      return { message: 'Success' };
    } catch (err) {
      throw new HttpException(`Error: ${err}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getUser(userId) {

    let user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions', 'tenant.branding'],
      select: {
        roles: {
          name: true,
          permissions:{
            name:true,
          }
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.profileImageUrl) {
      user.profileImageUrl = await createSignedLink(
        bucketName,
        user.profileImageUrl,
        'getObject',
      );
    }
    return user;
  }

  updateProfileURL(userId: string, profileImageUrl: string): Promise<UpdateResult> {
    profileImageUrl = profileImageUrl.replace("public/", "");
    return this.userRepository.update(userId, { profileImageUrl });
  }

  async getUserByEmail(email: string) {
    let user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
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

  async getAllUsers(filters: GetUserRequestDto2, user: User) {
    const { email, firstName, lastName, pageNumber, recordsPerPage, status } = filters;
    let skip = +(pageNumber - 1) * +recordsPerPage;
    const where = { tenantId: user.tenant.id, email: Not(user.email) };
    if (firstName)
      where['firstName'] = ILike(`%${firstName}%`);
    if (lastName)
      where['lastName'] = ILike(`%${lastName}%`);
    if (email)
      where['email'] = ILike(`%${email}%`);
    if (status)
      where['status'] = status.toUpperCase();
    console.log({ where });
    const options: FindManyOptions<User> = {
      order: {
        id: 'DESC',
      },
      where: where,
      relations: ['roles']
    }
    if (skip)
      options.skip = skip;
    if (recordsPerPage)
      options.take = recordsPerPage;

    const [data, total] = await this.userRepository.findAndCount(options);
    return {
      data,
      total,
    };
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

  async signUpUser(userdto: CreateUserDto) {
    const { firstName, lastName, email, password, mobilePhone } = userdto;
    const user = await this.userRepository.findOne({ where: { email }, relations: ['roles', 'roles.permissions'] });

    const isPendingUser = user && user.status === StatusEnum.PENDING;

    if (user && user.status === StatusEnum.ACTIVE) {
      throw new HttpException('Email Already Exists', HttpStatus.BAD_REQUEST);
    }

    const newUser = isPendingUser ? user : new User();

    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    newUser.mobilePhone = mobilePhone;
    if (!isPendingUser) {
      newUser.email = email;
      const role = await this.roleRepository.findOne({
        where: { name: RoleEnum.USER },
        relations: ["permissions"]
      });
      if (!role)
        throw new BadRequestException("This role does not exist.")
      newUser.roles = [role];
    }
    newUser.status = StatusEnum.ACTIVE;

    try {
      isPendingUser
        ? await this.userRepository.upsert(newUser, ['email'])
        : await this.dataSource.transaction(async (manager) => {
          const stripeCustomer = await this.stripeService.createCustomer(newUser.getFullName(), newUser.email);
          newUser.stripeCustomerId = stripeCustomer.id;
          return manager.save(User, newUser)
        });
      return newUser;
    } catch (error) {
      throw new HttpException(
        `Error saving database ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signUp(userDto: CreateTenantDto) {
    const user = await this.userRepository.findOne({
      where: { email: userDto.companyEmail }
    });
    const cName = await this.tenantRepository.findOne({
      where: { companyName: userDto.companyName }
    });
    if (cName)
      throw new HttpException('Company Name Already exists', HttpStatus.BAD_REQUEST);

    if (user)
      throw new HttpException('Email Already exists', HttpStatus.BAD_REQUEST);
    return this.dataSource.transaction(async (manager) => {
      const tenant = new Tenant();
      tenant.companyName = userDto.companyName;
      tenant.companyEmail = userDto.companyEmail;
      tenant.companyWebsite = userDto.companyWebsite;
      const user = new User();
      user.firstName = userDto.firstName;
      user.lastName = userDto.lastName;
      user.email = userDto.companyEmail;
      user.mobilePhone = userDto.mobilePhone;
      user.password = bcrypt.hashSync(userDto.password, bcrypt.genSaltSync());
      user.status = StatusEnum.ACTIVE;
      user.roles = [await this.roleRepository.findOne({
        where: { name: RoleEnum.ADMIN },
        relations: ["permissions"]
      })];
      const stripeCustomer = await this.stripeService.createCustomer(user.getFullName(), userDto.companyEmail);
      tenant.stripeCustomerId = stripeCustomer.id;

      //Saving default branding
      const branding = await this.brandingService.createFirstTime(manager);
      tenant.branding=branding;

      await manager.save(tenant);
      user.tenant = tenant;

      return manager.save(user);
    });
  }

  async findOneByEmail(email) {
    return this.userRepository.findOneBy({ email });
  }

  async validateUser(userDto: LoginDto): Promise<User> {
    const { email, password } = userDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["tenant", "roles", "roles.permissions"]
    });

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
        forgetPasswordToken: token,
      },
      select: [
        'id',
        'forgetPasswordToken',
        'forgetPasswordTokenExpires',
        'password',
      ],
    });
    if (dbUser) {
      if (moment().unix() > dbUser.forgetPasswordTokenExpires)
        throw new HttpException('Token expired', HttpStatus.FORBIDDEN);
      password = await this.hashPassword(password);
      dbUser.password = password;
      dbUser.forgetPasswordToken = null;
      dbUser.forgetPasswordTokenExpires = null;
      await this.userRepository.save(dbUser);
      return 'success';
    } else {
      throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);
    }
  }

  async inviteUser(email: string, roleId: string, tenant: Tenant = null): Promise<string> {
    const [role, emailExists] = await Promise.all([
      this.roleRepository.findOneBy({ id: roleId }),
      this.userRepository.findOneBy({ email }),
    ]);
    if (!role) {
      throw new NotFoundException('Role Not Found');
    }
    if (emailExists) {
      throw new HttpException('Email Already exists', HttpStatus.BAD_REQUEST);
    }
    const user = new User();
    user.email = email;
    user.roles = [role];
    user.tenant = tenant;
    const password = '123456';
    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
    user.status = StatusEnum.PENDING;const token = v4();
    user.forgetPasswordToken = token;

    await this.userRepository.save(user);

    // const token = await this.jwtService.sign({ email });

    return await this.mailService.sendUserInvite(user, token);
  }

  async deleteUser(userId) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const res = await this.userRepository.softDelete({ id: userId });
      if (res.affected == 0) {
        return {
          message: 'User not found',
        };
      } else {
        return {
          message: 'User deleted',
        };
      }
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

  async assignRoles(userRoles: AssignRolesDto) {
    const [user, roles] = await Promise.all([
      this.userRepository.findOneBy({ id: userRoles.userId }),
      this.roleRepository.find({ where: { id: In(userRoles.roleIds) } })
    ]);
    if (!user)
      throw new NotFoundException('User not found');
    if (!roles.length)
      throw new NotFoundException('No roles found');
    if (roles.length !== userRoles.roleIds.length)
      throw new NotFoundException('Some roles not found');
    user.roles = roles;
    return this.userRepository.save(user);
  }

  deletePicture(user: User) {
    // delete photo from public folder
    if (!user.profileImageUrl)
      throw new BadRequestException("Nothing to delete");
    const filePath = join(process.cwd(), user.profileImageUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
      }
    }
    user.profileImageUrl = null;
    return this.userRepository.save(user);
  }
}
