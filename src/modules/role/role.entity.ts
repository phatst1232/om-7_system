import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from '../permission/permission.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false })
  name: string;

  @Column({ unique: false })
  description: string;

  @Column({ length: 50 })
  status: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
