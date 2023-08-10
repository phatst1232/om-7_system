import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user.entity';
import { Role } from 'src/lib/entities/role.entity';
import { RoleService } from '../role/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here too
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECR'), // Replace with your actual config key
        signOptions: { expiresIn: '600s' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  providers: [AuthService, UserService, RoleService],
  controllers: [AuthController],
})
export class AuthModule {}
