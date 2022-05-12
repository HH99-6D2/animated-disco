import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }
  async findOneOrCreate(id: number, nickname: string): Promise<User> {
    return this.userRepository.findOne(id).then((user) => {
      if (!user) return this.create(id, nickname);
      if (!user.isActive) return user;
      else throw new ForbiddenException('you are out.');
    });
  }
}
