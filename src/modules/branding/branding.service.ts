import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Branding } from './entities/branding.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CreateBrandingDto } from './dto/create-branding.dto';
import { EditBrandingDto } from './dto/edit-branding.dto';

@Injectable()
export class BrandingService {
  constructor(
    @InjectRepository(Branding)
    private brandingRepository: Repository<Branding>,
  ) {}

  findAll() {
    return this.brandingRepository.find();
  }

  findOne(id: string) {
    return this.brandingRepository.findOne({ where: { id } });
  }

  create(body: CreateBrandingDto){
    return this.brandingRepository.save(this.brandingRepository.create(body))
  }

  edit(body: EditBrandingDto){
    return this.brandingRepository.update({id: body.id},body);
  }
}
