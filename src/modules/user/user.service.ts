import { RoleService } from './../role/role.service';
import { UpdateUserDto } from './../../lib/dto/user.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/lib/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/lib/dto/user.dto';
import { v4 as GenUUIDv4 } from 'uuid';
import { UserStatus } from 'src/lib/constant/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private RoleService: RoleService,
  ) {}

  async getAll(): Promise<User[]> {
    try {
      return this.userRepo.find({
        relations: {
          roles: true,
        },
      });
    } catch (error) {
      console.log('getAll - Service Error: ', error);
      throw new InternalServerErrorException(
        'Service Error - Failed to fetch all user',
      );
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepo.findOne({
        where: { id, status: UserStatus.ACTIVE },
      });
      if (!user) {
        throw new NotFoundException('getUserById - User not found');
      }
      return user;
    } catch (error) {
      console.log('getUserById - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed to fetch user by ID',
      );
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.userRepo.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existedUser) {
      throw new ConflictException('User already exists');
    }

    const defaultRole = await this.RoleService.getRoleByName('user');
    if (!defaultRole) {
      throw new InternalServerErrorException(
        'Service error - Fail to get default role(basic user)',
      );
    }

    const newUser = this.userRepo.create(createUserDto);
    try {
      newUser.id = GenUUIDv4();
      newUser.status = UserStatus.ACTIVE;
      newUser.roles = [defaultRole];
      await this.userRepo.save(newUser);
      return newUser;
    } catch (error) {
      console.log('createUser - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed to create user',
      );
    }
  }

  async createUserWithRole(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.userRepo.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existedUser) {
      throw new ConflictException('User already exists');
    }

    const roles = await this.RoleService.getRoleByIds(createUserDto.roleIds);
    if (!roles) {
      throw new NotFoundException('Invalid roleId');
    }

    const newUser = this.userRepo.create(createUserDto);
    try {
      newUser.id = GenUUIDv4();
      newUser.status = UserStatus.ACTIVE;
      newUser.roles = roles;
      await this.userRepo.save(newUser);
      return newUser;
    } catch (error) {
      console.log('createUser - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed to create user',
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepo.findOne({
        where: [{ id }, { status: UserStatus.ACTIVE }],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      this.userRepo.merge(user, updateUserDto);
      await this.userRepo.save(user);
      return user;
    } catch (error) {
      console.log('updateUser - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed to update user',
      );
    }
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id, status: UserStatus.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = UserStatus.INACTIVE;
    try {
      this.userRepo.save(user);
    } catch (error) {
      console.log('deleteUser - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed to delete user',
      );
    }
  }
}
