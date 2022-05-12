import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionA } from '../entities/regionA.entity';
import { RegionB } from '../entities/regionB.entity';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  getAllRegionA(): Promise<RegionA[]> {
    return this.regionsService.getAllRegionA();
  }

  @Get('/:regionAId')
  getRegionBByAId(
    @Param('regionAId', ParseIntPipe) regidonAId: number,
  ): Promise<RegionB[]> {
    return this.regionsService.getRegionBByAId(regidonAId);
  }
}
