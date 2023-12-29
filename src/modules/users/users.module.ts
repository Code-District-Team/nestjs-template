import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { jwtConstants } from 'src/generalUtils/constant';
import { MailModule } from "../mail/mail.module";
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { StripeModule } from "../stripe/stripe.module";
import { Tenant } from "../tenant/entities/tenant.entity";
import { Branding } from '../branding/entities/branding.entity';
import { BrandingModule } from '../branding/branding.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Tenant]),
    MailModule,
    StripeModule,
    BrandingModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.time },
    }),
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
