import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUserCreateData } from './interfaces/create-user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(userCreateData: IUserCreateData): Promise<User> {
    const createUserDto = new CreateUserDto();
    createUserDto.id = userCreateData.id;
    createUserDto.nickname = userCreateData.nickname;
    createUserDto.imageUrl = userCreateData.imageUrl;
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findOne(id: number) {
    return await this.userRepository.findOneOrFail(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
