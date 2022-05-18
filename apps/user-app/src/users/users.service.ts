import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isInstance } from 'class-validator';
import {
  DeleteResult,
  EntityNotFoundError,
  Raw,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(id: number, nickname: string): Promise<User> {
    const createUserDto = new CreateUserDto();
    createUserDto.id = id;
    createUserDto.nickname = nickname;
    const user = this.userRepository.create(createUserDto);
    try {
      return await this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException('DB Not working');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return this.userRepository.findOneOrFail(id, { loadRelationIds: true });
    } catch (err) {
      throw isInstance(err, EntityNotFoundError)
        ? new NotFoundException('User Not Found')
        : new InternalServerErrorException('DB Not working');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async findOneOrCreate(id: number, nickname: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne(id);
      return !user ? this.create(id, nickname) : user;
    } catch (err) {
      throw new InternalServerErrorException('DB Not working');
    }
  }
}
