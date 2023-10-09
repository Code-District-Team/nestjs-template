import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import jwt_decode from "jwt-decode";
import { Repository, SelectQueryBuilder } from "typeorm";
import { User } from "../modules/users/entities/user.entity";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    let user: User;
    const { rawHeaders, headers } = req;
    const token = headers.authorization?.split(" ");

    if (!token) throw new HttpException("Authorization token is required", HttpStatus.UNAUTHORIZED);

    let decoded: any;
    try {
      decoded = jwt_decode(token[1]);
    } catch (e) {
      throw new HttpException("Failed to decode token", HttpStatus.UNAUTHORIZED);
    }
    const email = decoded.email;

    if (!email) throw new HttpException("Email is required, please login again", HttpStatus.UNAUTHORIZED);

    const queryBuilder: SelectQueryBuilder<User> = this.userRepository.createQueryBuilder("user");
    const selects: string[] = [
      "user.id",
      "user.firstName",
      "user.lastName",
      "user.email",
      "user.status",
      "user.rolesId",
    ];
    user = await queryBuilder.select(selects).getOne();


    req.body = {
      ...req.body,
      user: user,
    };
    next();
  }
}
