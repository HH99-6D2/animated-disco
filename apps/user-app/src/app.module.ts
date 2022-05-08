import { Module } from '@nestjs/common';
import { UserAppController } from './app.controller';
import { UserAppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UserAppController],
  providers: [UserAppService],
})
export class UserAppModule {}
