import { Injectable } from '@nestjs/common';
import { Role } from 'src/lib/entities/role.entity';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  constructor(protected readonly )
  async getRoleById(roleId: string): Promise<Role> {
    return 
  }
}
@InjectRepository(User)