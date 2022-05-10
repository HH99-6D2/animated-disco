import { Tag } from '../../tags/entities/tag.entity';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Long,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column({ type: 'float' })
  positionX: number;

  @Column({ type: 'float' })
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

  // @ManyToMany(() => Tag, (tags) => tags.id)
  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
