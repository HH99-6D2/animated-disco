import { Column, OneToMany } from 'typeorm';
import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';
import { RegionB } from './regionB.entity';
import { Room } from './room.entity';

@Entity()
export class RegionA extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => RegionB, (regionB) => regionB.id)
  regionB: RegionB;

  @OneToMany(() => Room, (room) => room.id)
  room: Room;
}
