import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity'; // Import User entity

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  description: string;

  @OneToMany(() => User, (user) => user.roleId) // One role can be associated with many users
  users: User[];
}
