import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/lib/entities/role.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    protected roleRopo: Repository<Role>,
  ) {}

  async getAllRoles(): Promise<Role[]> {
    try {
      const roles = await this.roleRopo.find();

      if (!roles) {
        throw new NotFoundException('No role found');
      }
      return roles;
    } catch (error) {
      console.log('getAllRoles - Service Error: ', error);
      throw new InternalServerErrorException(
        'Service Error - Failed to fetch all roles',
      );
    }
  }

  async getRoleByIds(roleIds: string[]): Promise<Role[]> {
    try {
      const roles = await this.roleRopo.findBy({ id: In(roleIds) });

      if (!roles) {
        throw new NotFoundException('Role not found');
      }

      return roles;
    } catch (error) {
      console.log('getRoleById - Service Error: ', error);
      throw new InternalServerErrorException(
        'Service Error - Failed to fetch role by ID',
      );
    }
  }

  async getRoleByName(roleName: string): Promise<Role> {
    try {
      const role = await this.roleRopo.findOne({
        where: { name: roleName },
      });

      if (!role) {
        throw new NotFoundException('Role not found with roleName: ', roleName);
      }

      return role;
    } catch (error) {
      console.log('getRoleByName - Service Error: ', error);
      throw new InternalServerErrorException(
        'Service Error - Failed to fetch role by name: ',
        roleName,
      );
    }
  }
}
