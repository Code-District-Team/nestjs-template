import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolePermissionsModule } from './modules/role-permissions/role-permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { User } from "./modules/users/entities/user.entity";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { UsersController } from "./modules/users/users.controller";

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forRoot(seedSourceOptions),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    MailModule,
    ProductModule,
    HeroModule,
    UserRolesModule,
    PermissionsModule,
    RolePermissionsModule,
    RolesModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(UsersController);
  }
}
