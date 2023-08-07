import { Role } from './../../lib/entities/role.entity';
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
import { UserRole, UserStatus } from 'src/lib/constant/constants';
import { v4 as GenUUIDv4 } from 'uuid';
import { Role } from 'src/lib/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private roleRepo: Repository<Role>,
  ) {}

  async getAll(): Promise<User[]> {
    try {
      return this.userRepo.find();
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
        where: [{ id }, { status: UserStatus.ACTIVE }],
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
    createUserDto.status = UserStatus.ACTIVE;
    const roleName = createUserDto.roleName;
    const role = await this.roleRepo.findRoleByName(createUserDto.roleName);


    createUserDto.roleId = UserRole.USER;

    const existedUser = await this.userRepo.findOne({
      where: [
        { username: createUserDto.username },
        { status: UserStatus.ACTIVE },
      ],
    });

    if (existedUser) {
      throw new ConflictException('User already exists');
    }

    const newUser = this.userRepo.create(createUserDto);
    try {
      newUser.id = GenUUIDv4();
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
    const user = await this.userRepo.findOne({ where: { id } });
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
