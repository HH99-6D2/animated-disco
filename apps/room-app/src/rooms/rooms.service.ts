import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomRepository } from './room.repository';
import { TagRepository } from '../tags/tag.repository';
import { Not } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomRepository)
    private roomRepository: RoomRepository,
    private tagRepository: TagRepository,
  ) {}

  async getAllRooms(): Promise<Room[]> {
    const rooms = await this.roomRepository.find({
      status: Not(2),
    });
    return rooms;
  }

  async getRoomById(id: number): Promise<Room> {
    const room = await this.roomRepository.findOne({
      id,
      status: Not(2),
    });
    return room;
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<void> {
    const { tags } = createRoomDto;

    const roomTags = await this.tagRepository.findOrInsert(tags);

    const room = this.roomRepository.create({
      ...createRoomDto,
      userId: 1,
      status: new Date(createRoomDto.startDate) <= new Date() ? 1 : 0,
      tags: roomTags,
    });

    await this.roomRepository.save(room);
  }

  async updateRoomStatus(id: number, status: number): Promise<void> {
    await this.roomRepository.update(id, { status });
  }
}
