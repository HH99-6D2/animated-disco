import { RoomsModule } from '../rooms/rooms.module';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
@Unique(['name'])
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
