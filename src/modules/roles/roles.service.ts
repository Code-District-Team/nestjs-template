import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from "./dto/createRole.dto";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Role } from './entities/role.entity';
import { DataSource, DeleteResult, In, Not, Repository } from "typeorm";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Permission } from "../permissions/entities/permission.entity";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
    @InjectDataSource()
    private dataSource: DataSource
  ) {
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const permissions = await this.permissionRepository.find({ where: { id: In(createRoleDto.permissionIds) } });
    if (!permissions || permissions.length !== createRoleDto.permissionIds.length) return null;
    const role = new Role();
    role.name = createRoleDto.name;
    role.permissions = permissions;
    try {
      return await this.roleRepository.save(role);
    } catch (e) {
      if (e.code === '23505') {
        return null;
      }
    }
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ["permissions"] });

  }

  findOne(id: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { id } });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const permissionIds = updateRoleDto.permissionIds;
    const role = await this.roleRepository.findOne({ where: { id } });
    const nameIsUnique = updateRoleDto.name ?
      await this.roleRepository.findOne({ where: { name: updateRoleDto.name, id: Not(id) } }) : true;
    if (!role || !nameIsUnique) return null;
    const permissions = await this.permissionRepository.find({ where: { id: In(permissionIds) } })
    if (!permissions || permissions.length !== permissionIds.length)
      return null;
    return this.setRolePermissions(id, permissions);
  }

  // transaction
  private async setRolePermissions(id: string, permissionIds: Permission[]) {
    return await this.dataSource.transaction(async (manager) => {
      await manager.delete('role_permissions', { role_id: id });
      const role = new Role();
      role.id = id;
      role.permissions = permissionIds;
      return await manager.save(role);
    });
  }

  remove(id: string): Promise<DeleteResult> {
    return this.roleRepository.delete(id);
  }
}
