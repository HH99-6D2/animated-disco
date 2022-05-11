import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from '../entities/room.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  getAllRooms(): Promise<Room[]> {
    return this.roomsService.getAllRooms();
  }

  @Get('/:id')
  getRoomById(@Param('id', ParseIntPipe) id: number): Promise<Room> {
    return this.roomsService.getRoomById(id);
  }

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto): Promise<void> {
    return this.roomsService.createRoom(createRoomDto);
  }

  @Delete('/:id')
  deleteRoom(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.roomsService.updateRoomStatus(id, 2);
  }
}
