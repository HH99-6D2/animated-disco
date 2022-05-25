import { Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { RegionA } from './regionA.entity';
import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class RegionB extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @PrimaryColumn()
  regionAId: number;
  
  @ManyToOne(() => RegionA, (regionA) => regionA.id)
  regionA: RegionA;

  @OneToMany(() => Room, (room) => room.id)
  room: Room;
}
