import {
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  Redirect,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { kakaoSocialData } from './interfaces/social-data.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService,
  ) {}

  @Get('login')
  login() {
    return Redirect(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile_nickname,account_email,profile_image`,
    );
  }

  @Get('oauth')
  async oauth(@Query('code') code, @Query('error') error) {
    if (error) return HttpCode(500);
    const now = Date.now();
    const userData: kakaoSocialData = await this.authService.requestUserInfo(
      code,
    );
    const authUser =
      userData.connected_at.getDate() < now
        ? await this.authService.findOne(userData.id, 'kakao')
        : await this.authService.create(new CreateAuthDto(userData));
    const user = await this.userService.find(authUser.id);
    return await this.authService.createToken(user);
  }

  @Post('logout')
  logout() {
    return 'logout!';
  }
}
