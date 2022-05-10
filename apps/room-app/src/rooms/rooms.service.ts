import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomRepository } from './room.repository';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomRepository)
    private roomRepository: RoomRepository,
  ) {}

  async getAllRooms(): Promise<Room[]> {
    const rooms = await this.roomRepository.find();
    return rooms;
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<void> {
    const {
      title,
      positionX,
      positionY,
      startDate,
      endDate,
      categoryId,
      maxUser,
      imageUrl,
      regionAId,
      regionBId,
    } = createRoomDto;

    const room = this.roomRepository.create({
      userId: 1,
      title,
      positionX,
      positionY,
      startDate,
      endDate,
      categoryId,
      maxUser,
      imageUrl,
      regionAId,
      regionBId,
      status: new Date(startDate) <= new Date() ? 1 : 0,
    });

    await this.roomRepository.save(room);
  }
}
