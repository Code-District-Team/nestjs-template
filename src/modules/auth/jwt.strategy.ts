import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
// import { Strategy } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../users/user.repository";
import { User } from "../users/users.entity";
import { jwtConstants } from "./constants";
import { jwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: jwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("You are not authorized to perform the operation");
    }
    return user;
  }
}
