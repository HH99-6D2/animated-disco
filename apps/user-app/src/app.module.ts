import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { UserAppController } from './app.controller';
//import { UserAppService } from './app.service';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.development.env' }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      port: 3306,
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      entities: [User],
      synchronize: true,
      migrations: ['dist/apps/user-app/src/db/migrations/*.js'],
      cli: {
        migrationsDir: 'apps/user-app/src/db/migrations',
      },
    }),
    UsersModule,
  ],
  controllers: [
    //   UserAppController
  ],
  providers: [
    //   UserAppService
  ],
})
export class UserAppModule {}
