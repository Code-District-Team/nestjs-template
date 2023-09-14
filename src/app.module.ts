import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { seedSourceOptions } from './config/seed.config';
import { MailModule } from './modules/mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductModule } from './modules/product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { HeroModule } from './modules/hero/hero.module';
import { BullModule } from "@nestjs/bull";
import { MailConsumer } from "./process-consumer/mail-consumer";

@Module({
  imports: [
    // MailConsumer,
    CacheModule.register({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      renderPath: "/public",
      serveRoot: "/public",
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forRoot(seedSourceOptions),
    UsersModule,
    AuthModule,
    MailModule,
    ProductModule,
    HeroModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
