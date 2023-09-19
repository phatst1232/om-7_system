import { RoleService } from './../role/role.service';
import {
  GetUserDto,
  UpdateUserDto,
  SearchDataDto,
  GetListUserDto,
  UpdateUserStatusDto,
} from './dto/user.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { CreateUserDto } from 'src/modules/user/dto/user.dto';
import { v4 as GenUUIDv4 } from 'uuid';
import { CommonStatus } from 'src/shared/constant/constants';
import { SignInDto } from 'src/modules/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private RoleService: RoleService,
  ) {}

  async getAllUser(): Promise<User[]> {
    return this.userRepo.find({
      relations: {
        roles: true,
      },
    });
  }

  async getUserSearch(dto: SearchDataDto): Promise<GetUserDto[]> {
    // const whereCond = [];
    // if (dto.searchData) {
    //   whereCond.push({ username: ILike(`%${dto.searchData}%`) });
    // }
    // if (dto.fullName) {
    //   whereCond.push({ fullName: dto.fullName });
    // }
    const listUser = await this.userRepo.find({
      where: {
        status: Not(CommonStatus.DELETED),
        username: ILike(`%${dto.searchData}%`),
      },
      relations: {
        roles: true,
      },
    });
    const dataRes = [];
    listUser.map((user) => {
      const usr = new GetUserDto();

      usr.id = user.id;
      usr.username = user.username;
      usr.fullName = user.fullName;
      usr.email = user.email;
      usr.gender = user.gender;
      usr.image = user.image;
      usr.createdAt = user.createdAt;
      usr.dateOfBirth = user.dateOfBirth;
      usr.roles = user.roles.map((role) => role.name);
      usr.status = user.status;

      dataRes.push(usr);
    });
    return dataRes;
  }

  async getUserById(id: string): Promise<GetUserDto> {
    const user = await this.userRepo.findOne({
      where: { id, status: CommonStatus.ACTIVE },
      relations: {
        roles: true,
      },
    });
    if (!user) {
      throw new NotFoundException('getUserById - User not found');
    }
    const getUserRes: GetUserDto = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      gender: user.gender,
      image: user.image,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      roles: user.roles.map((role) => role.name),
      status: user.status,
    };
    return getUserRes;
  }

  async getLoginUser(signInDto: SignInDto): Promise<GetUserDto> {
    const user = await this.userRepo.findOne({
      where: { username: signInDto.username, status: CommonStatus.ACTIVE },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException('Invalid password');
    }
    const getUserRes: GetUserDto = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      gender: user.gender,
      image: user.image,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      // roles: user.roles.map((role) => role.name),
      status: user.status,
    };
    return getUserRes;
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
      newUser.status = CommonStatus.ACTIVE;
      newUser.roles = [defaultRole];
      await this.userRepo.save(newUser);
      return newUser;
    } catch (error) {
      console.log('createUser - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed when create user',
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

    const roles = await this.RoleService.getRoleById(createUserDto.roleIds);
    if (!roles) {
      throw new NotFoundException('Invalid roleId');
    }

    const newUser = this.userRepo.create(createUserDto);
    try {
      newUser.id = GenUUIDv4();
      newUser.status = CommonStatus.ACTIVE;
      newUser.roles = roles;
      await this.userRepo.save(newUser);
      return newUser;
    } catch (error) {
      console.log('createUser - Service error: ', error);
      throw new InternalServerErrorException(
        'Service error - Failed when create user',
      );
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<GetUserDto> {
    const user = await this.userRepo.findOne({
      where: [{ id }],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userRepo.merge(user, updateUserDto);
    await this.userRepo.save(user);
    const getUserRes: GetUserDto = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      // email: user.email,
      gender: user.gender,
      image: user.image,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      // roles: user.roles.map((role) => role.name),
      status: user.status,
    };
    return getUserRes;
  }

  async updateUserStatus(
    id: string,
    updateUserDto: UpdateUserStatusDto,
  ): Promise<GetUserDto> {
    const user = await this.userRepo.findOne({
      where: [{ id }],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // user.status = updateUserDto.status;
    this.userRepo.merge(user, updateUserDto);

    await this.userRepo.save(user);
    const getUserRes: GetUserDto = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      // email: user.email,
      gender: user.gender,
      image: user.image,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      // roles: user.roles.map((role) => role.name),
      status: user.status,
    };
    return getUserRes;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = CommonStatus.DELETED;
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
