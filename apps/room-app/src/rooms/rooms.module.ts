import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRepository } from './room.repository';
import { TagRepository } from '../tags/tag.repository';
import { RegionARepository, RegionBRepository } from '../regions/region.repository';

@Module({
  imports:[TypeOrmModule.forFeature([RoomRepository, TagRepository, RegionARepository, RegionBRepository])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
