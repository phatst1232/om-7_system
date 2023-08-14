import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/lib/entities/user.entity';
import { Role } from 'src/lib/entities/role.entity';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    UserModule,
    RoleModule,
    TypeOrmModule.forFeature([User, Role]),
    // ConfigModule.forRoot(),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule], // Import ConfigModule here too
    //   useFactory: (configService: ConfigService) => ({
    //     global: true,
    //     secret: configService.get<string>('JWT_SECR'), // Replace with your actual config key
    //     signOptions: { expiresIn: '600s' },
    //   }),
    //   inject: [ConfigService], // Inject ConfigService
    // }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECR,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
