import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionARepository, RegionBRepository } from './region.repository';
import { RegionsController } from './regions.controller';

@Module({
  imports:[TypeOrmModule.forFeature([RegionARepository, RegionBRepository])],
  controllers: [RegionsController],
  providers: [RegionsService]
})
export class RegionsModule {}
