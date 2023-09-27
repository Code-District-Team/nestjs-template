import { Injectable } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../roles/entities/role.entity";
import { DeleteResult, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { UserRole } from "./entities/user-role.entity";

@Injectable()
export class UserRolesService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
              @InjectRepository(User) private readonly userRepository: Repository<User>,
              @InjectRepository(UserRole) private readonly userRoleRepository: Repository<UserRole>) {
  }

  async create(createUserRoleDto: CreateUserRoleDto) {
    const [user, role] = await Promise.all([
      this.userRepository.findOneBy({ id: createUserRoleDto.userId }),
      this.roleRepository.findOneBy({ id: createUserRoleDto.roleId })
    ]);
    if (!user || !role) return null;
    const userRole = this.userRoleRepository.create({
      userId: user.id,
      roleId: role.id
    });
    return this.userRepository.save(userRole);
  }

  findAll(): Promise<UserRole[]> {
    return this.userRoleRepository.find({ relations: ['user', 'role'] });
  }

  findOne(userId: string): Promise<UserRole[]> {
    return this.userRoleRepository.find({ where: { userId }, relations: ['user', 'role'] });
  }

  removeRole(userId: string, roleId: string): Promise<DeleteResult> {
    return this.userRoleRepository.delete({ userId, roleId });
  }

  removeAllRoles(userId: string): Promise<DeleteResult> {
    return this.userRoleRepository.delete({ userId });
  }
}
