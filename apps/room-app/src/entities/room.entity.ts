import { Tag } from './tag.entity';
import { Like } from './like.entity';
import { ManyToOne } from 'typeorm';
import { RegionA } from './regionA.entity';
import { RegionB } from './regionB.entity';
import { Category } from './category.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 20, scale: 14, default: 0 })
  positionX: number;

  @Column({ type: 'decimal', precision: 20, scale: 14, default: 0 })
  positionY: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  maxUser: number;

  @Column()
  imageUrl: string;

  @Column({ type: 'tinyint', default: 0 }) // 0: 대기, 1: 활성, 2: 종료
  status: number;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Like, (like) => like.roomId)
  like: Like;

  @ManyToOne(() => Category, (category) => category.id )
  @JoinColumn({
    name:'categoryId',
    referencedColumnName:'id'
  })
  categoryId: Category;


  @ManyToOne(() => RegionA, (regionA) => regionA.id)
  @JoinColumn({
    name:'regionAId',
    referencedColumnName:'id'
  })
  regionAId: RegionA;


  @ManyToOne(() => RegionB, (regionB) => regionB.id)
  @JoinColumn({
    name:'regionBId',
    referencedColumnName:'id'
  })
  regionBId: RegionB;
}
