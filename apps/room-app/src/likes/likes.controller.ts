import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '../utils/auth.guard';
import { GetUser } from '../utils/decorator/get-user.decorator';
import { User } from '../entities/user.interface';

@Controller('rooms/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get('/:roomId')
  @UseGuards(AuthGuard)
  createLike(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.likesService.createLike(roomId, user.id);
  }

  @Delete('/:roomId')
  deleteLike(
    @Param('roomId', ParseIntPipe) roomId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.likesService.deleteLike(roomId, user.id);
  }
}
