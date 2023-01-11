import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static/dist/serve-static.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import seedConfig from "./config/seed.config";
import typeOrmConfig from "./config/typeorm.config";
import { AuthModule } from "./modules/auth/auth.module";
import { MailModule } from "./modules/mail/mail.module";
import { UserRepository } from "./modules/users/user.repository";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRoot(seedConfig),
    TypeOrmModule.forFeature([UserRepository]),
    AuthModule,
    MailModule,

    UsersModule,
  ],
  controllers: [],
})
export class AppModule {}
