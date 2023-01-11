import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { constants, STRIPE_STATUSES } from "../auth/constants";
import { UserProfileDto } from "./dto/user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}
  async updateProfile(userId, profileDto: UserProfileDto) {
    const user = await this.userRepository.findOne({ id: userId });
    // user.email = profileDto.email;
    user.firstName = profileDto.firstName;
    user.lastName = profileDto.lastName;
    user.pictureUrl = profileDto.pictureUrl;
    const updatedUser = await user.save();

    return { ...updatedUser, name: user.lastName ? user.firstName + " " + user.lastName : user.firstName };
  }

  async getUser(userId) {
    let user = await this.userRepository.findOne({ id: userId }, { relations: ["plans"] });
    // delete user.organization;

    return { ...user, name: user.lastName ? user.firstName + " " + user.lastName : user.firstName };
  }

  async getUserwithUuid(uuid) {
    let user = await this.userRepository.findOne(
      { uuid },
      { select: ["id", "email", "firstName", "lastName", "uuid", "pictureUrl"] }
    );
    return { ...user, name: user.lastName ? user.firstName + " " + user.lastName : user.firstName };
  }

  async getAllUsers(filters) {
    let user = await this.userRepository.createQueryBuilder("user");

    if (filters.pageNumber && filters.recordsPerPage) {
      filters.pageNumber -= 1;
      let skip = +filters.pageNumber * +filters.recordsPerPage;
      user = user.skip(skip).take(filters.recordsPerPage);
    }

    return await user.orderBy("user.id", "DESC").getMany();
  }

  async findAll(pageNumber, recordsPerPage) {
    let resData;
    if (pageNumber && recordsPerPage) {
      pageNumber -= 1;
      let skip = +pageNumber * +recordsPerPage;
      const [result, total] = await this.userRepository.findAndCount({
        order: {
          id: "DESC",
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
          id: "DESC",
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

  async deleteUser(userId) {
    const user = await this.userRepository.findOne({ id: userId });
    if (user.subscriptionStatus == STRIPE_STATUSES.ACTIVE || user.subscriptionStatus == STRIPE_STATUSES.TRAILING) {
      try {
        const res = await this.userRepository.softDelete({ id: userId });
        return "User deleted";
      } catch (e) {
        throw new HttpException(e, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
