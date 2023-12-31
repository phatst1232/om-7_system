import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/modules/permission/permission.entity';
import { Role } from 'src/modules/role/role.entity';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) {
      return false;
    }

    const userPermissions = user.roles.flatMap(
      (role: Role) => role.permissions,
    );
    const hasPermission = matchPermissions(
      requiredPermissions,
      userPermissions,
    );

    return hasPermission;
  }
}

function matchPermissions(
  listAcceptablePermissions: string[],
  userPermissions: Permission[],
): boolean {
  listAcceptablePermissions.some((permission) => {
    if (userPermissions.some((p) => p.name === permission)) return true;
  });
  return false;
}
