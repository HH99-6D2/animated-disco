import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.blockUsers, {
    cascade: true,
    primary: true,
  })
  user: number;

  @ManyToOne(() => User, { cascade: false })
  blockUser: number;
}
