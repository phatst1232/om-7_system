import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/lib/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const listAcceptableRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!listAcceptableRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.roles) {
      throw new UnauthorizedException();
    }
    if (!matchRoles(listAcceptableRoles, user.roles)) {
      throw new ForbiddenException();
    }
    return true;
  }
}

function matchRoles(listAcceptableRoles: string[], userRoles: Role[]): boolean {
  listAcceptableRoles.some((role) => {
    if (userRoles.some((r) => r.name === role)) return true;
  });
  return false;
}
