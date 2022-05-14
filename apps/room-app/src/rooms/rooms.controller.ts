import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from '../entities/room.entity';
import { AuthGuard } from '../utils/auth.guard';
import { GetUser } from '../utils/decorator/get-user.decorator';
import { User } from '../entities/user.interface';

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
  @UseGuards(AuthGuard)
  createRoom(@Body() createRoomDto: CreateRoomDto, @GetUser() user: User): Promise<void> {
    return this.roomsService.createRoom(createRoomDto, user.id);
  }

  @Delete('/:id')
  deleteRoom(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.roomsService.updateRoomStatus(id, 2);
  }
}
