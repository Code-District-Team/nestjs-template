import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationRepository } from "../organization/organization.repository";
import { UserRepository } from "../users/user.repository";
import { UploadImagesController } from "./upload-images.controller";
import { UploadImagesService } from "./upload-images.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([OrganizationRepository]),
    TypeOrmModule.forFeature([UserRepository]),
    MulterModule.register({
      dest: "./upload",
    }),
  ],
  providers: [UploadImagesService],
  controllers: [UploadImagesController],
})
export class UploadImagesModule {}
