import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';
import { RoleService } from './role/role.service';

@Module({
  imports: [UserModule, CoreModule],
  providers: [RoleService],
})
export class AppModule {}
