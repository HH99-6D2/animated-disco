import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockService } from './block.service';
import { Block } from './entities/block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Block])],
  controllers: [],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
