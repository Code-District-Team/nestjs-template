import { ConflictException, HttpException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { constants } from "../auth/constants";
import { EntityRepository, Repository } from "typeorm";
import { LoginDto, UserDto } from "./dto/user.dto";
import { User } from "./users.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createOrganizationUser(userDto: UserDto, userOrganization): Promise<any> {
    const { firstName, lastName, email, password } = userDto;

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.organizationId = userOrganization.id;
    user.type = constants.OrgUserTypeName;

    await user.save();
    return this.findOne({ email: user.email }, { loadEagerRelations: false });
  }
  async getOrgUserByOrgId(orgId: number) {
    return await this.findOne({ organizationId: orgId, type: constants.OrgUserTypeName });
  }
  async signUp(userDto: UserDto, userOrganization): Promise<any> {
    const { firstName, lastName, email, password, domainPrefix } = userDto;

    const salt = await bcrypt.genSalt();

    const exists = await this.findOne({ email });
    if (exists) {
      throw new HttpException("Email Already exists", HttpStatus.BAD_REQUEST);
    }

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.organizationId = userOrganization.id;
    try {
      await user.save();

      return "Success";
    } catch (error) {
      if (error.code === "23505") {
        throw new HttpException("Email Already exists", HttpStatus.BAD_REQUEST);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async findOneByEmail(email) {
    return this.findOne({ email: email });
  }

  async validateUserPassword(userDto: LoginDto): Promise<User> {
    const { email, password } = userDto;
    const user = await this.findOne(
      { email },
      { relations: ["organization"], select: ["id", "email", "password", "salt", "firstName", "lastName", "type"] }
    );

    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  async hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }

  async changePasswordUser(oldPassword, newPassword, user: any): Promise<string> {
    const dbUser = await this.findOne(
      { id: user.id },
      { select: ["id", "email", "password", "salt", "firstName", "lastName", "type"] }
    );
    if (dbUser && (await bcrypt.compare(oldPassword, dbUser.password))) {
      newPassword = await this.hashPassword(newPassword, dbUser.salt);
      dbUser.password = newPassword;
      await dbUser.save();
      return "success";
    } else {
      return "Invalid User Credentials";
    }
  }

  async resetPassword(token, password) {
    //get teh user from db by token
    //hadh the password
    //set the new passsword
    ////set token to null
    const dbUser = await this.findOne(
      { forgetPasswordToken: token },
      { select: ["id", "email", "password", "salt", "firstName", "lastName", "type", "forgetPasswordToken", "expires"] }
    );
    if (dbUser) {
      password = await this.hashPassword(password, dbUser.salt);
      dbUser.password = password;
      dbUser.forgetPasswordToken = null;
      dbUser.expires = null;
      await dbUser.save();
      return "success";
    } else {
      return "Invalid Token (User not found)";
    }
  }
}
