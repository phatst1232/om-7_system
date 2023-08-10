import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from 'src/lib/config/typeorm.config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    RoleModule,
    UserModule,
    AuthModule,
  ],
  exports: [CoreModule],
})
export class CoreModule {}
