import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserProfileDto } from "./dto/user.dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}
  async updateProfile(userId, profileDto: UserProfileDto) {
    const user = await this.userRepository.findOne({ id: userId });
    user.address = profileDto.address;
    user.bio = profileDto.bio;
    user.country = profileDto.country;
    // user.email = profileDto.email;
    user.firstName = profileDto.firstName;
    user.lastName = profileDto.lastName;
    user.profilePicture = profileDto.profilePicture;
    return await user.save();
  }
}
