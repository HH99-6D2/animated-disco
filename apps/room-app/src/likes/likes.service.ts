import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeRepository)
    private likeRepository: LikeRepository,
  ) {}

  async createLike(roomId: number, userId: number): Promise<void> {
    const like = this.likeRepository.create({
      roomId,
      userId,
    });
    await this.likeRepository.save(like);
  }

  async deleteLike(roomId: number, userId: number): Promise<void> {
    const like = this.likeRepository.delete({
      roomId,
      userId,
    });
  }
}
