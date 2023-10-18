import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { Tenant } from "./entities/tenant.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TenantService {
  constructor(@InjectRepository(Tenant) private tenantRepository: Repository<Tenant>) {
  }

  findAll() {
    return this.tenantRepository.find();
  }
}
