import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignInDto } from 'src/lib/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.getLoginUser(signInDto);
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException('Invalid Password');
    }
    const payload = { sub: user.id, username: user.username };
    return {
      message: 'Login success!',
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
