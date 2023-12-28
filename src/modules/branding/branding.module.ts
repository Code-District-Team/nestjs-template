import { Module } from '@nestjs/common';
import { BrandingService } from './branding.service';
import { BrandingController } from './branding.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branding } from "./entities/branding.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ Branding ])],
  providers: [BrandingService],
  controllers: [BrandingController],
  exports: [BrandingService]
})
export class BrandingModule {
}
