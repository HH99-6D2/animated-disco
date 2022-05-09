import {
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  Redirect,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { kakaoSocialData } from './interfaces/social-data.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get('login')
  login(@Res() res) {
    return res
      .status(302)
      .redirect(
        `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code&scope=profile_nickname,account_email,profile_image`,
      );
  }

  @Get('oauth')
  async oauth(@Query('code') code: string, @Query('error') error: string) {
    if (error) return HttpCode(500);
    const now = Date.now();
    const authToken = await this.authService.getSocialToken(code);
    const userData = await this.authService.getSocialInfo(authToken);
    const connected_Date = Date.parse(
      userData.connected_at.replace('T', 'Z').slice(0, 19),
    );
    if (connected_Date > now) {
      console.log('NEW AUTH');
    } else {
      console.log('ALREADY AUTH');
    }
    /*    const authUser =
      userData.connected_at.getDate() < now
        ? await this.authService.findOne(+userData.id, 'kakao')
        : await this.authService.create(new CreateAuthDto());
    const user = await this.userService.findOne(+authUser.id);
    return await this.authService.createToken(user);
    */
    return JSON.stringify(userData);
  }

  @Post('logout')
  logout() {
    return 'logout!';
  }
}
