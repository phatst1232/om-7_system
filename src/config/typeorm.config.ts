import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { Role } from 'src/modules/role/role.entity';
import { ConfigService } from '@nestjs/config';
import { Permission } from '../modules/permission/permission.entity';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres', // Specify the type of your database (e.g., 'mysql', 'postgres', etc.)
      host: configService.get<string>('DB_HOST'),
      port: parseInt(configService.get<string>('DB_PORT'), 10),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [User, Role, Permission],
      migrations: [join(__dirname, 'src', 'migrations', '*.ts')],
      synchronize: true,
      logging: true,
    };
  },
  inject: [ConfigService], // Inject ConfigService
};
