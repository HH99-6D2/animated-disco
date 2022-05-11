import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { typeORMConfig } from './configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), LikesModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
