import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tenant } from "./entities/tenant.entity";
import { User } from "../users/entities/user.entity";
import { Branding } from '../branding/entities/branding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, User])],
  providers: [TenantService],
  controllers: [TenantController],
  exports: [TenantService]
})
export class TenantModule {
}
