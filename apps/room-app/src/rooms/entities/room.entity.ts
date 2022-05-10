import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Long,
  CreateDateColumn,
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

  @Column({ nullable: true })
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
}
