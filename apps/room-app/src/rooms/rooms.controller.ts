import { Body, Controller, Get, Post } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  getAllRooms(): Promise<Room[]> {
    return this.roomsService.getAllRooms();
  }

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto): Promise<void> {
    return this.roomsService.createRoom(createRoomDto);
  }
}
