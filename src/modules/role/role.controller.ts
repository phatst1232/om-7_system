import { RoleService } from './role.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from 'src/lib/dto/role.dto';
import { Role } from 'src/lib/entities/role.entity';

@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAllRole(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) ids: string[]): Promise<Role[]> {
    return this.roleService.getRoleByIds(ids);
  }

  @Get('get-by-name:name')
  async getByName(@Param('name') name: string): Promise<Role> {
    return this.roleService.getRoleByName(name);
  }

  @Post()
  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleService.createRole(createRoleDto);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.roleService.deleteRole(id);
  }
}
