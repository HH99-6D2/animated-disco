import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ nullable: false })
  id: number;
  @Column({ type: 'varchar', length: 60 })
  nickname: string;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
