import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isInstance } from 'class-validator';
import { EntityNotFoundError, Raw, Repository } from 'typeorm';
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
    try {
      const user = await this.userRepository.findOne(id);

      if (user) {
        const lastWeek = new Date(Date.now() - 1000 * 60 ** 2 * 24 * 7);
        const reported_cnt = await this.reportRepository.count({
          reportUser: id,
          createdDate: Raw((alias) => `${alias} > :date`, {
            date: lastWeek,
          }),
        });
        if (reported_cnt > 4) throw new ForbiddenException('you are out.');
      }

      return !user ? this.create(id, nickname) : user;
    } catch (err) {
      throw new InternalServerErrorException('DB Not working');
    }
  }

  async report(id: number, createReportDto: CreateReportDto): Promise<Report> {
    let report: Report;

    createReportDto.user = id;
    report = await this.reportRepository.findOne({
      reportUser: createReportDto.reportUser,
      user: createReportDto.user,
    });
    if (report) throw new ConflictException('Already reported');
    report = this.reportRepository.create(createReportDto);

    return this.reportRepository.save(report);
  }
}
