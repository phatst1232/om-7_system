import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignInDto } from 'src/modules/auth/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.getLoginUser(signInDto);
    const payload = { sub: user.id, username: user.username };
    return {
      message: 'Login success!',
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
