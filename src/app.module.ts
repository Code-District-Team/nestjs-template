import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static/dist/serve-static.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import seedConfig from "./config/seed.config";
import typeOrmConfig from "./config/typeorm.config";
import { AddOrgIdToReqBody } from "./middlewares/addOrgIdToReqBody.middleware";
import { TenantMiddleware } from "./middlewares/tenant.middleware";
import { AuthModule } from "./modules/auth/auth.module";
import { MailModule } from "./modules/mail/mail.module";
import { OrganizationController } from "./modules/organization/organization.controller";
import { OrganizationModule } from "./modules/organization/organization.module";
import { OrganizationRepository } from "./modules/organization/organization.repository";
import { UploadImagesModule } from "./modules/upload-images/upload-images.module";
import { UserRepository } from "./modules/users/user.repository";
import {ConfigModule} from "@nestjs/config"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRoot(seedConfig),
    TypeOrmModule.forFeature([UserRepository, OrganizationRepository]),
    AuthModule,
    OrganizationModule,
    MailModule,
    UploadImagesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: "api/organization/uploads/logo/(.*)", method: RequestMethod.GET },
        { path: "/api/questions/public-question/(.*)", method: RequestMethod.GET },
        { path: "/api/organization", method: RequestMethod.POST },
        { path: "/api/organization", method: RequestMethod.GET },
        { path: "/api/organization", method: RequestMethod.PUT },
        { path: "/api/organization/(.*)", method: RequestMethod.DELETE },
        { path: "/api/organization/uploads/logo", method: RequestMethod.POST },
        { path: "/api/organization/uploads/logo/(.*)", method: RequestMethod.GET },
        { path: "/api/organization/search", method: RequestMethod.GET },
        { path: "/api/organization/(.*)", method: RequestMethod.GET },
      )
      .forRoutes(
        UploadImagesModule,
        OrganizationController,
      );
  }
}
