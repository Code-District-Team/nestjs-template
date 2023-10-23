import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { Tenant } from "./entities/tenant.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";

@Injectable()
export class TenantService {
  constructor(@InjectRepository(Tenant) private tenantRepository: Repository<Tenant>,
              @InjectRepository(User) private userRepository: Repository<User>) {
  }

  findAll() {
    return this.tenantRepository.find();
  }

  findOne(tenantId: string) {
    return this.userRepository.find({ where: { tenantId }, relations: ["tenant"] });
  }
}
