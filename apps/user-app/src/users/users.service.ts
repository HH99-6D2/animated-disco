import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isInstance } from 'class-validator';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
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
    try {
      return await this.userRepository.findOneOrFail(id);
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
    return this.userRepository.findOne(id).then((user) => {
      if (user && !user.isActive) throw new ForbiddenException('you are out.');
      return !user ? this.create(id, nickname) : user;
    });
  }
  async report(id: number, createReportDto: CreateReportDto): Promise<Report> {
    let is_reported: number;
    createReportDto.user = id;
    await this.findOne(createReportDto.reportUser);
    is_reported = await this.reportRepository.count({
      reportUser: createReportDto.reportUser,
      user: createReportDto.user,
    });
    if (is_reported) throw new ConflictException('Already reported');
    const report = this.reportRepository.create(createReportDto);
    const report_count = await this.reportRepository.count({
      reportUser: createReportDto.reportUser,
    });
    if (report_count >= 4)
      await this.userRepository.update(createReportDto.reportUser, {
        isActive: false,
      });
    return this.reportRepository.save(report);
  }
}
