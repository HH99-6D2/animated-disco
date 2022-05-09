import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomRepository } from './room.repository';

@Module({
  imports:[TypeOrmModule.forFeature([RoomRepository])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
