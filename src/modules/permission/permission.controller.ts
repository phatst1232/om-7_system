import { PermissionService } from './permission.service';
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
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from 'src/lib/dto/permission.dto';
import { Permission } from 'src/lib/entities/permission.entity';

@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async getAllPermission(): Promise<Permission[]> {
    return this.permissionService.getAllPermissions();
  }

  // @Get(':id')
  // async getById(
  //   @Param('id', ParseUUIDPipe) ids: string[],
  // ): Promise<Permission[]> {
  //   return this.permissionService.getPermissionByIds(ids);
  // }

  @Get('get-by-name:name')
  async getByName(@Param('name') name: string): Promise<Permission> {
    return this.permissionService.getPermissionByName(name);
  }

  @Post()
  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.updatePermission(id, updatePermissionDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionService.deletePermission(id);
  }
}
