import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Block } from '../../block/entities/block.entity';

@Entity()
export class User {
  @PrimaryColumn({ nullable: false })
  id: number;
  @Column({ type: 'varchar', length: 16, nullable: true })
  nickname: string;
  @OneToMany(() => Block, (block) => block.user)
  blockUsers: Block[];
}
