import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from './user.entity'; // Import User entity

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  description: string;
}
