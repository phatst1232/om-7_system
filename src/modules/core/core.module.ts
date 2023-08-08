import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/lib/entities/role.entity';
import { User } from 'src/lib/entities/user.entity';
import ORMConfig from 'typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123212',
      database: 'postgres',
      entities: [User, Role],
      synchronize: true,
      logging: true,
    }),
    // TypeOrmModule.forRoot(ORMConfig),
  ],
})
export class CoreModule {}
