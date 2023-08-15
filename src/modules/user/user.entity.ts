import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../role/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  @Index({ unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  @Index({ unique: true })
  username: string;

  @Column({ length: 100 })
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ nullable: true })
  gender: boolean;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ length: 50 })
  status: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
