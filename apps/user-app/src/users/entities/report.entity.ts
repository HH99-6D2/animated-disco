import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { cascade: true, primary: true })
  user: number;

  @ManyToOne(() => User, { cascade: false, primary: true })
  reportUser: number;

  @Column({ type: 'varchar', nullable: false, length: 128 })
  content: string;

  @CreateDateColumn()
  createdDate: Date;
}
