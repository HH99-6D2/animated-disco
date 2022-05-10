import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { typeORMConfig } from './configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
