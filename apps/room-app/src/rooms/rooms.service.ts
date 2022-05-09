import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomRepository)
    private roomRepository: RoomRepository,
  ) {}

 async getAllRooms(): Promise<Room[]> {
   const rooms = await this.roomRepository.find();

   return rooms
 }
}
