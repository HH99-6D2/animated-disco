import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialService } from '../social/social.service';
import { UsersModule } from '../users/users.module';
import { ReportModule } from '../report/report.module';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), UsersModule, ReportModule],
  controllers: [AuthController],
  providers: [AuthService, SocialService],
})
export class AuthModule {}
