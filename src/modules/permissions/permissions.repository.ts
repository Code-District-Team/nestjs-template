// permission.repository.ts
import { EntityTarget, EntityManager, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

export class PermissionRepository extends Repository<Permission> {
    constructor(
        public entity: EntityTarget<Permission>,
        public manager: EntityManager
    ) {
        super(entity, manager);
    }

    async createPermission(dto: CreatePermissionDto): Promise<Permission> {
        const permission = this.create(dto);
        return this.manager.save(permission);
    }

    async findAll(): Promise<Permission[]> {
        return this.manager.find(this.entity);
    }

    async findOneById(id: string): Promise<Permission> {
        return this.manager.findOne(this.entity, { where: { id } });
    }

    async updatePermission(id: string, dto: UpdatePermissionDto): Promise<UpdateResult> {
        return this.manager.update(this.entity, id, dto);
    }

    async deletePermission(id: string): Promise<DeleteResult> {
        return this.manager.delete(this.entity, id);
    }

}
