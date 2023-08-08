import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user.entity';
import { Role } from 'src/lib/entities/role.entity';

const ORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123212',
  database: 'postgres',
  entities: [User, Role],
  synchronize: true,
  logging: true,
};

export = ORMConfig;
