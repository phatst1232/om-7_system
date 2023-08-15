import { UpdateRoleDto } from './dto/role.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonStatus, UserStatus } from 'src/shared/constant/constants';
import { CreateRoleDto } from 'src/modules/role/dto/role.dto';
import { Role } from 'src/modules/role/role.entity';
import { In, Repository } from 'typeorm';
import { v4 as GenUUIDv4 } from 'uuid';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    protected roleRopo: Repository<Role>,
  ) {}

  async getAllRoles(): Promise<Role[]> {
    const roles = await this.roleRopo.find();
    if (!roles) {
      throw new NotFoundException('No role found');
    }
    return roles;
  }

  async getRoleByIds(roleIds: string[]): Promise<Role[]> {
    const roles = await this.roleRopo.findBy({ id: In(roleIds) });
    if (!roles) {
      throw new NotFoundException('Role not found');
    }
    return roles;
  }

  async getRoleByName(roleName: string): Promise<Role> {
    const role = await this.roleRopo.findOne({
      where: { name: roleName },
    });
    if (!role) {
      throw new NotFoundException('Role not found with roleName: ', roleName);
    }
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existedRole = await this.roleRopo.findOne({
      where: { name: createRoleDto.name },
    });
    if (existedRole) {
      throw new ConflictException('Role already exists');
    }
    const newRole = this.roleRopo.create(createRoleDto);
    try {
      newRole.id = GenUUIDv4();
      newRole.status = CommonStatus.ACTIVE;
      await this.roleRopo.save(newRole);
      return newRole;
    } catch (error) {
      console.log('createRole - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed when create role',
      );
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRopo.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    this.roleRopo.merge(role, updateRoleDto);
    await this.roleRopo.save(role);
    return role;
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.roleRopo.findOne({
      where: { id, status: CommonStatus.ACTIVE },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.status = CommonStatus.INACTIVE;
    try {
      this.roleRopo.save(role);
    } catch (error) {
      console.log('deleteRole - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed to delete role',
      );
    }
  }
}
