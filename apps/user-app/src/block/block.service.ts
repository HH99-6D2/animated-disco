import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isInstance } from 'class-validator';
import {
  DeleteResult,
  EntityNotFoundError,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { DeleteBlockDto } from './dto/delete-block.dto';
import { Block } from './entities/block.entity';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block) private blockRepository: Repository<Block>,
  ) {}

  async create(id: number, createBlockDto: CreateBlockDto): Promise<Block> {
    let block: Block;
    createBlockDto.user = id;
    block = await this.blockRepository.findOne(createBlockDto);
    if (block) throw new ConflictException('Already blocked');
    block = this.blockRepository.create(createBlockDto);
    try {
      return await this.blockRepository.save(block);
    } catch (err) {
      throw isInstance(err, QueryFailedError)
        ? new NotFoundException('Block User Not found')
        : new InternalServerErrorException('DB Not Working');
    }
  }

  async remove(
    id: number,
    deleteBlockDto: DeleteBlockDto,
  ): Promise<DeleteResult> {
    deleteBlockDto.user = id;
    const toDelete = await this.blockRepository.findOne(deleteBlockDto);
    if (!toDelete) throw new NotFoundException('Not blocked User');
    return this.blockRepository.delete(toDelete);
  }
}
