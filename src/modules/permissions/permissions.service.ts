import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { DeleteResult, Repository, UpdateResult } from "typeorm";

@Injectable()
export class PermissionsService {

  constructor(@InjectRepository(Permission) private permissionRepository: Repository<Permission>) {
  }

  create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionRepository.save(
      this.permissionRepository.create(createPermissionDto)
    );
  }

  findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  findOne(id: string): Promise<Permission> {
    return this.permissionRepository.findOne({ where: { id } });
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<UpdateResult> {
    return this.permissionRepository.update(id, updatePermissionDto);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.permissionRepository.delete(id);
  }
}
