import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialService } from '../social/social.service';
import { UsersModule } from '../users/users.module';
import { ReportModule } from '../report/report.module';
import { BlockModule } from '../block/block.module';
import { S3Service } from '../s3/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    UsersModule,
    ReportModule,
    BlockModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SocialService, S3Service],
})
export class AuthModule {}