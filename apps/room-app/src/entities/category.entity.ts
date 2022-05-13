import { Column, OneToMany } from 'typeorm';
import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Room, (room) => room.id)
  room: Room;
}
