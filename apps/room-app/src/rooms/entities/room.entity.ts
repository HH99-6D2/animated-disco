import { Tag } from '../../tags/entities/tag.entity';
import { Like } from '../../likes/entities/like.entity';
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
  categoryId: number;

  @Column()
  maxUser: number;

  @Column()
  imageUrl: string;

  @Column()
  regionAId: number;

  @Column()
  regionBId: number;

  @Column({ type: 'tinyint', default: 0 }) // 0: 대기, 1: 활성, 2: 종료
  status: number;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Like, (like) => like.roomId)
  like: Like;
}
