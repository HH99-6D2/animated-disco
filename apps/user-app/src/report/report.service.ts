import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isInstance } from 'class-validator';
import { QueryFailedError, Raw, Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  async create(id: number, createReportDto: CreateReportDto) {
    let report: Report;

    createReportDto.user = id;
    try {
      report = await this.reportRepository.findOne({
        reportUser: createReportDto.reportUser,
        user: createReportDto.user,
      });
    } catch (err) {
      new InternalServerErrorException('DB Not Working');
    }
    if (report) throw new ConflictException('Already reported');
    report = this.reportRepository.create(createReportDto);
    try {
      return await this.reportRepository.save(report);
    } catch (err) {
      throw isInstance(err, QueryFailedError)
        ? new NotFoundException('Report User Not found')
        : new InternalServerErrorException('DB Not Working');
    }
  }

  async isValid(id: number) {
    try {
      const lastWeek = new Date(Date.now() - 1000 * 60 ** 2 * 24 * 7);
      const reported_cnt = await this.reportRepository.count({
        reportUser: id,
        createdDate: Raw((alias) => `${alias} > :date`, {
          date: lastWeek,
        }),
      });
      if (reported_cnt > 4) throw new ForbiddenException('you are out.');
      return true;
    } catch (err) {
      throw new InternalServerErrorException('DB Not working');
    }
  }
}
