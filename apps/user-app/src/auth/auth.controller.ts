import {
  Controller,
  Get,
  Query,
  HttpCode,
  Response,
  NotAcceptableException,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('auth')
@Controller('social')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get('login')
  socialLogin(@Response() response, @Query('provider') provider: string) {
    if (provider === 'kakao')
      return response
        .status(302)
        .redirect(
          `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code&scope=profile_nickname,account_email,profile_image`,
        );
    else throw new NotAcceptableException();
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const user = await this.authService.validateUser(loginAuthDto);
    const token = await this.authService.createToken(user);
    return { ...user, token };
  }

  @Get('oauth')
  async oauth(
    @Response() response,
    @Query('code') code: string,
    @Query('error') error: string,
  ) {
    if (error) return HttpCode(500);

    const token = await this.authService.getSocialToken(code);
    const socialInfo = await this.authService.getSocialInfo(
      token['data']['access_token'],
    );
    const authUser = await this.authService.findOneOrCreate(
      1,
      socialInfo['id'],
    );
    const user = await this.userService.findOneOrCreate(authUser.id);
    return response.json({
      accessToken: token['data']['access_token'],
      ...user,
    });
  }
}
