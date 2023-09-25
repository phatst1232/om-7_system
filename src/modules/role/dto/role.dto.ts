import { Permission } from 'src/modules/permission/permission.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  permissions: Permission[];
}

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  // Add validation for permissions if needed
}
