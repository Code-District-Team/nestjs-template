import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandingRepository } from './branding.repository';
import { CreateBrandingDto } from './dto/create-branding.dto';
import { EntityManager } from 'typeorm';
import { Branding } from './entities/branding.entity';


@Injectable()
export class BrandingService {
  private brandingRepository: BrandingRepository;

  constructor(private manager: EntityManager) {
    this.brandingRepository = new BrandingRepository(Branding, manager);
  }
  async findAll(){
    return await this.brandingRepository.findAll();
  }

  findOne(id: string) {
    return this.brandingRepository.findOneById(id);
  }

  create(body: CreateBrandingDto){
    return this.brandingRepository.createBranding(body);
  }

  createFirstTime(manager: EntityManager){
    console.log('manager' , manager);
    return this.brandingRepository.createFirstTime(manager);
  }

  edit(id: string, body: CreateBrandingDto){
    return this.brandingRepository.editBranding(id, body);
  }
}
