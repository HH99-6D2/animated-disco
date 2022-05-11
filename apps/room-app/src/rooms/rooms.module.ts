import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRepository } from './room.repository';
import { TagRepository } from '../tags/tag.repository';

@Module({
  imports:[TypeOrmModule.forFeature([RoomRepository, TagRepository])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
