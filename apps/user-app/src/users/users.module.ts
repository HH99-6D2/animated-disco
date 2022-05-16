import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Report } from './entities/report.entity';
import { Block } from './entities/block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Report, Block])],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
