import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  userId:number;

  @Column()
  title: string;
  
  @Column()
  positionX: number;
  
  @Column()
  positoinY: number;
  
  @Column()
  createdDate: Date;
  
  @Column()
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
  regioAId: number;
  
  @Column()
  regioBId: number;
}