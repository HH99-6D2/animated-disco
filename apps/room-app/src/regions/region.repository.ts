import { EntityRepository, Repository } from 'typeorm';
import { RegionA } from '../entities/regionA.entity';
import { RegionB } from '../entities/regionB.entity';

@EntityRepository(RegionA)
export class RegionARepository extends Repository<RegionA> {}

@EntityRepository(RegionB)
export class RegionBRepository extends Repository<RegionB> {}

