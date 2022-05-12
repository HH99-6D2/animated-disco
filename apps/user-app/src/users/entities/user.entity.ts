import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ nullable: false })
  id: number;
  @Column({ type: 'varchar', length: 16, nullable: true })
  nickname: string;
  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;
}
