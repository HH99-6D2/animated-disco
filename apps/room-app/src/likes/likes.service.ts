import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';
import { Like } from './entities/like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeRepository)
    private likeRepository: LikeRepository,
  ) {}

  async createLike(roomId: number): Promise<Like> {
    const like = this.likeRepository.create({
      roomId,
      userId: 1,
    });
    await this.likeRepository.save(like);
    return like;
  }

  async deleteLike(roomId: number): Promise<void> {
    const like = this.likeRepository.delete({
      roomId,
      userId: 1,
    });
  }
}
