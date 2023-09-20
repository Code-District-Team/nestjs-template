import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from "./dto/createRole.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from './entities/role.entity';
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { UpdateRoleDto } from "./dto/update-role.dto";

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {
  }

  create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleRepository.save(
      this.roleRepository.create(createRoleDto)
    )
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  findOne(id: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { id } });
  }

  update(id: string, updateRoleDto: UpdateRoleDto): Promise<UpdateResult> {
    return this.roleRepository.update(id, updateRoleDto);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.roleRepository.delete(id);
  }
}
