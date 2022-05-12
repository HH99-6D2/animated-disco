import { Injectable } from '@nestjs/common';
import { RegionARepository, RegionBRepository } from './region.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionA } from '../entities/regionA.entity';
import { RegionB } from '../entities/regionB.entity';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(RegionARepository)
    @InjectRepository(RegionBRepository)
    private regionARepository: RegionARepository,
    private regionBRepository: RegionBRepository,
  ) {}

  async getAllRegionA(): Promise<RegionA[]> {
    const regionAs = await this.regionARepository.find();
    return regionAs;
  }

  async getRegionBByAId(regionAId: number): Promise<RegionB[]> {
    const regionBs = await this.regionBRepository.find({ regionAId });
    return regionBs;
  }
}
