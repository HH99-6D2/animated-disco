import { Module } from '@nestjs/common';
import { UserAppController } from './app.controller';
import { UserAppService } from './app.service';

@Module({
  imports: [],
  controllers: [UserAppController],
  providers: [UserAppService],
})
export class UserAppModule {}
