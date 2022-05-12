import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { typeORMConfig } from './configs/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesModule } from './likes/likes.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RegionsModule } from './regions/regions.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    LikesModule,
    RoomsModule,
    RegionsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('rooms', 'likes');
  }
}
