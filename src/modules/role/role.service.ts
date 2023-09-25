import { UpdateRoleDto } from './dto/role.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonStatus } from 'src/shared/constant/constants';
import { CreateRoleDto } from 'src/modules/role/dto/role.dto';
import { Role } from 'src/modules/role/role.entity';
import { ILike, In, Not, Repository } from 'typeorm';
import { v4 as GenUUIDv4 } from 'uuid';
import { SearchDataDto } from '../user/dto/user.dto';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    protected roleRepo: Repository<Role>,
    protected permissionService: PermissionService,
  ) {}

  async getAllRole(): Promise<Role[]> {
    const roles = await this.roleRepo.find();
    if (!roles) {
      throw new NotFoundException('No role found');
    }
    return roles;
  }

  async getRoleSearch(dto: SearchDataDto): Promise<Role[]> {
    const listRole = await this.roleRepo.find({
      where: {
        status: Not(CommonStatus.DELETED),
        name: ILike(`%${dto.searchData}%`),
      },
      relations: {
        permissions: true,
      },
    });
    return listRole;
  }

  async getRoleById(roleIds: string[]): Promise<Role[]> {
    const roles = await this.roleRepo.findBy({ id: In(roleIds) });
    if (!roles) {
      throw new NotFoundException('Role not found');
    }
    return roles;
  }

  async getRoleByName(roleName: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { name: roleName },
    });
    if (!role) {
      throw new NotFoundException('Role not found with roleName: ', roleName);
    }
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const existedRole = await this.roleRepo.findOne({
        where: { name: createRoleDto.name, status: Not(CommonStatus.DELETED) },
      });
      if (existedRole) {
        throw new ConflictException('Role already exists');
      }
      const newRole = this.roleRepo.create(createRoleDto);

      //get Permissions
      if (createRoleDto.permissions) {
        const listPmsId = createRoleDto.permissions?.map((per) => per.id);
        const rolePermissions = await this.permissionService.getListPermissions(
          listPmsId,
        );
        if (rolePermissions) {
          newRole.permissions = rolePermissions;
        }
      }

      newRole.id = GenUUIDv4();
      newRole.status = CommonStatus.ACTIVE;
      await this.roleRepo.save(newRole);
      return newRole;
    } catch (error) {
      console.log('createRole - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed when create role',
      );
    }
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    this.roleRepo.merge(role, updateRoleDto);
    await this.roleRepo.save(role);
    return role;
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.roleRepo.findOne({
      where: { id, status: Not(CommonStatus.DELETED) },
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.status = CommonStatus.DELETED;
    try {
      this.roleRepo.save(role);
    } catch (error) {
      console.log('deleteRole - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed to delete role',
      );
    }
  }
}
