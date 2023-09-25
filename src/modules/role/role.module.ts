import { PermissionService } from './../permission/permission.service';
import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/modules/role/role.entity';
import { Permission } from '../permission/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RoleController],
  providers: [RoleService, PermissionService],
  exports: [RoleModule],
})
export class RoleModule {}
