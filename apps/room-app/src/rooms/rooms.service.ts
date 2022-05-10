import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomRepository } from './room.repository';
import { TagRepository } from '../tags/tag.repository';
import { Tag } from '../tags/entities/tag.entity';
import { create } from 'domain';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomRepository)
    private roomRepository: RoomRepository,
    private tagRepository: TagRepository,
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
      tags,
    } = createRoomDto;

    const roomTags = await this.tagRepository.findOrInsert(tags);

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
      tags: roomTags,
    });

    await this.roomRepository.save(room);
  }
}
