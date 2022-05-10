import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'socialProfile' })
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'tinyint', default: 1, nullable: false, unsigned: true })
  provider: number;
  @Column({ type: 'varchar', nullable: false, unique: true, length: 16 })
  socialId: string;
  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string;
  @DeleteDateColumn()
  unlinkedAt: Date;
}
