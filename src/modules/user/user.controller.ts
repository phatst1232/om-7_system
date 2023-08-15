import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/lib/entities/user.entity';
import { CreateUserDto, GetUserDto, UpdateUserDto } from 'src/lib/dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('user')
@ApiTags('user')
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Get()
  async getAll(): Promise<User[]> {
    return this.userService.getAllUser();
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<GetUserDto> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('create-user-with-role')
  async createUserWithRole(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.userService.createUserWithRole(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
