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
import { CreateRoleDto, UpdateRoleDto } from 'src/modules/role/dto/role.dto';
import { Role } from 'src/modules/role/role.entity';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { SearchDataDto } from '../user/dto/user.dto';

@Controller('role')
@ApiTags('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles('admin')
  @Get()
  async getAllRole(): Promise<Role[]> {
    return this.roleService.getAllRole();
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) ids: string[]): Promise<Role[]> {
    return this.roleService.getRoleById(ids);
  }

  @Get('get-by-name:name')
  async getByName(@Param('name') name: string): Promise<Role> {
    return this.roleService.getRoleByName(name);
  }

  @Post('list')
  async getRoleSearch(@Body() searchRoleDto: SearchDataDto): Promise<Role[]> {
    return await this.roleService.getRoleSearch(searchRoleDto);
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
