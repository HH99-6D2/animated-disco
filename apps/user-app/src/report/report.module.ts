import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportService } from './report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
