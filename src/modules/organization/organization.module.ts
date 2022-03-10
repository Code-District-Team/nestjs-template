import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "../users/user.repository";
import { OrganizationController } from "./organization.controller";
import { OrganizationRepository } from "./organization.repository";
import { OrganizationService } from "./organization.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([OrganizationRepository]),
    TypeOrmModule.forFeature([UserRepository]),
    MulterModule.register({
      dest: "./upload",
    }),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
