// permissions.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { DeleteResult, EntityManager, UpdateResult } from 'typeorm';
import { PermissionRepository } from './permissions.repository';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
    private permissionRepository: PermissionRepository;

    constructor(private manager: EntityManager) {
        this.permissionRepository = new PermissionRepository(Permission, manager);
    }

    async create(dto: CreatePermissionDto): Promise<Permission> {
        try {
            return await this.permissionRepository.createPermission(dto);
        } catch (e) {
            if (e.code === '23505') {
                throw new BadRequestException('Permission already exists');
            }
        }
    }

    async findAll(): Promise<Permission[]> {
        return this.permissionRepository.findAll();
    }

    async findOne(id: string): Promise<Permission> {
        return this.permissionRepository.findOneById(id);
    }

    async update(id: string, dto: UpdatePermissionDto): Promise<UpdateResult> {
        return this.permissionRepository.updatePermission(id, dto);
    }

    async remove(id: string): Promise<DeleteResult> {
        return this.permissionRepository.deletePermission(id);
    }

}
