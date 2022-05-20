import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';
import { SocialService } from './social/social.service';
import { ReportModule } from './report/report.module';
import { Report } from './report/entities/report.entity';
import { BlockModule } from './block/block.module';
import { Block } from './block/entities/block.entity';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.development.env' }),
    TypeOrmModule.forRoot({
      host: process.env.DATABASE_HOST,
      type: 'mariadb',
      port: 3306,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      entities: [User, Auth, Report, Block],
      synchronize: true,
      migrations: ['dist/apps/user-app/src/db/migrations/*.js'],
      cli: {
        migrationsDir: 'apps/user-app/src/db/migrations',
      },
    }),
    UsersModule,
    AuthModule,
    ReportModule,
    BlockModule,
  ],
  controllers: [
    //   UserAppController
  ],
  providers: [
    //   UserAppService
    SocialService,
    S3Service,
  ],
})
export class UserAppModule {}
