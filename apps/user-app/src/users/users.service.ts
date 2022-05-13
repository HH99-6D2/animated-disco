import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Report } from './entities/report.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Report) private reportRepository: Repository<Report>,
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
      if (user && !user.isActive) throw new ForbiddenException('you are out.');
      return !user ? this.create(id, nickname) : user;
    });
  }
  async report(id: number, createReportDto: CreateReportDto): Promise<Report> {
    createReportDto.user = id;
    const is_reported = await this.reportRepository.find({
      reportUser: createReportDto.reportUser,
    });
    if (is_reported.filter((el) => el.user === createReportDto.user))
      throw new ConflictException('Already reported');
    const report = this.reportRepository.create(createReportDto);
    if (is_reported.length === 4)
      await this.userRepository.update(createReportDto.reportUser, {
        isActive: false,
      });
    return this.reportRepository.save(report);
  }
}
