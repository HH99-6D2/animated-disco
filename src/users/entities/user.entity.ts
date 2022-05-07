import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true, nullable: false, length: 60 })
  email: string;
  @Column({ type: 'varchar', nullable: false, length: 20 })
  nickname: string;
  @Column({ type: 'boolean', default: true, nullable: false })
  active: boolean;
  @Column({ type: 'varchar', default: null })
  imageUrl: string;
  @DeleteDateColumn()
  deletedDate: Date;
  @CreateDateColumn()
  createdDate: Date;
}
