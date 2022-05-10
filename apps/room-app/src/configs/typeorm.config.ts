import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Room } from '../rooms/entities/room.entity';
import { Tag } from '../tags/entities/tag.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'room',
  // entities: [__dirname + '/../**/*.entity{.js,.ts}'],
  entities: [Room, Tag],
  synchronize: true,
};