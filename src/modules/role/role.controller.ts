import { RoleService } from './role.service';
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
