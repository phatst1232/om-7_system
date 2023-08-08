import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';
import { RoleController } from './role/role.controller';
import { RoleModule } from './role/role.module';

@Module({
  imports: [UserModule, CoreModule, RoleModule],
  controllers: [RoleController],
})
export class AppModule {}
