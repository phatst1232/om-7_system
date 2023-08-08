import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user.entity';
import { Role } from 'src/lib/entities/role.entity';
import { RoleService } from '../role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UserController],
  providers: [UserService, RoleService],
  exports: [UserModule],
})
export class UserModule {}
