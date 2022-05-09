import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'socialprofile' })
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'tinyint', default: 1, nullable: false })
  provider: number;
  @Column({ type: 'int', nullable: false, unique: true })
  socialId: number;
  @Column({ type: 'varchar', length: 64, nullable: true })
  email: string;
  @DeleteDateColumn()
  unlinkedAt: Date;
}
