import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
// import { Strategy } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../users/user.repository";
import { User } from "../users/entities/users.entity";
import { jwtConstants, STRIPE_STATUSES } from "./constants";
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
    const user = await this.userRepository.findOne({ email }, {relations: ["plans"]});
    if (!user) {
      throw new UnauthorizedException("You are not authorized to perform the operation");
    }
    return user;
  }
}
