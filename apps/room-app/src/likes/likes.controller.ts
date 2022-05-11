import { Controller, Get, Param, ParseIntPipe, Delete, Logger } from '@nestjs/common';
import { LikesService } from './likes.service';
import { Like } from '../entities/like.entity';

@Controller('rooms/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get('/:roomId')
  createLike(@Param('roomId', ParseIntPipe) roomId: number): Promise<Like> {
    return this.likesService.createLike(roomId);
  }

  @Delete('/:roomId')
  deleteLike(@Param('roomId', ParseIntPipe) roomId: number): Promise<void> {
    return this.likesService.deleteLike(roomId);
  }
}
