import { UpdatePermissionDto } from './dto/permission.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonStatus } from 'src/shared/constant/constants';
import { CreatePermissionDto } from 'src/modules/permission/dto/permission.dto';
import { Permission } from 'src/modules/permission/permission.entity';
import { ILike, In, Not, Repository } from 'typeorm';
import { v4 as GenUUIDv4 } from 'uuid';
import { SearchDataDto } from '../user/dto/user.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    protected permissionRepo: Repository<Permission>,
  ) {}

  async getAllPermissions(): Promise<Permission[]> {
    const permissions = await this.permissionRepo.find();
    if (!permissions) {
      throw new NotFoundException('No permission found');
    }
    return permissions;
  }

  async getPermissionSearch(dto: SearchDataDto): Promise<Permission[]> {
    const listPermission = await this.permissionRepo.find({
      where: {
        status: Not(CommonStatus.DELETED),
        name: ILike(`%${dto.searchData}%`),
      },
      order: { name: 'ASC' },
    });
    return listPermission;
  }

  async getPermissionByName(permissionName: string): Promise<Permission> {
    const permission = await this.permissionRepo.findOne({
      where: { name: permissionName },
    });
    if (!permission) {
      throw new NotFoundException(
        'Permission not found with permissionName: ',
        permissionName,
      );
    }
    return permission;
  }

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    const existedPermission = await this.permissionRepo.findOne({
      where: { name: createPermissionDto.name },
    });
    if (existedPermission) {
      throw new ConflictException('Permission already exists');
    }
    const newPermission = this.permissionRepo.create(createPermissionDto);
    try {
      newPermission.id = GenUUIDv4();
      newPermission.status = CommonStatus.ACTIVE;
      await this.permissionRepo.save(newPermission);
      return newPermission;
    } catch (error) {
      console.log('createPermission - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed when create permission',
      );
    }
  }

  async updatePermission(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.permissionRepo.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    this.permissionRepo.merge(permission, updatePermissionDto);
    await this.permissionRepo.save(permission);
    return permission;
  }

  async deletePermission(id: string): Promise<void> {
    const permission = await this.permissionRepo.findOne({
      where: { id, status: CommonStatus.ACTIVE },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    permission.status = CommonStatus.INACTIVE;
    try {
      this.permissionRepo.save(permission);
    } catch (error) {
      console.log('deletePermission - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed to delete permission',
      );
    }
  }
}
