import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: false })
  description: string;

  @Column({ length: 50 })
  status: string;
}
