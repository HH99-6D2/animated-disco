import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomRepository } from './room.repository';
import { TagRepository } from '../tags/tag.repository';
import { Not } from 'typeorm';
import { User } from '../entities/user.interface';

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

    if (rooms.length <= 0) {
      throw new NotFoundException();
    }

    return rooms;
  }

  async getRoomById(id: number): Promise<Room> {
    const room = await this.roomRepository.findOne({
      id,
      status: Not(2),
    });
    if (room == null) {
      throw new NotFoundException();
    }

    return room;
  }

  async createRoom(
    createRoomDto: CreateRoomDto,
    userId: number,
  ): Promise<void> {
    const { tags } = createRoomDto;
    try {
      const roomTags = await this.tagRepository.findOrInsert(tags);

      const room = this.roomRepository.create({
        ...createRoomDto,
        userId,
        status: new Date(createRoomDto.startDate) <= new Date() ? 1 : 0,
        tags: roomTags,
      });

      await this.roomRepository.save(room);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async updateRoomStatus(id: number, status: number): Promise<void> {
    const room = await this.getRoomById(id);
    await this.roomRepository.update(id, { status });
  }
}
