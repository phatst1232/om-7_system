import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { Role } from 'src/modules/role/role.entity';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service';
import { PermissionModule } from '../permission/permission.module';
import { Permission } from '../permission/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    PermissionModule,
  ],
  controllers: [UserController],
  providers: [UserService, RoleService, PermissionService],
  exports: [UserService],
})
export class UserModule {}
