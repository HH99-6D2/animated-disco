import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { Tag } from '../entities/tag.entity';
import { Like } from '../entities/like.entity';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({ envFilePath: '.room.development.env' })

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // entities: [__dirname + '/../**/*.entity{.js,.ts}'],
  entities: [Room, Tag, Like],
  synchronize: true,
};
