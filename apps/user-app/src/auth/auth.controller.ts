import { Controller, Get, Query, Response, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocialService } from '../social/social.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('auth')
@Controller('social')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly socialService: SocialService,
  ) {}

  @Get('login')
  async socialLogin(@Response() response, @Query('provider') provider: string) {
    const redirectUrl = this.socialService.getLoginUrl(provider);
    return response.status(302).redirect(redirectUrl);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const socialTokenInfo = await this.socialService.getTokenInfo(
      loginAuthDto.accessToken,
    );
    const user = await this.authService.validateUser(
      loginAuthDto.id,
      `${socialTokenInfo['data']['id']}`,
    );
    const token = await this.authService.createToken(user);
    return { ...user, token };
  }

  @Get('oauth')
  async oauth(
    @Response() response,
    @Query('code') code: string,
    //    @Query('error') error: string,
  ) {
    //   if (error) throw new UnauthorizedException('Kakao login rejected');
    const token = await this.socialService.getToken(code);
    const socialInfo = await this.socialService.getUserInfo(
      token['data']['access_token'],
    );
    const authUser = await this.authService.findOneOrCreate(
      1,
      socialInfo['data']['id'],
    );
    const user = await this.userService.findOneOrCreate(authUser.id);
    return response.json({
      accessToken: token['data']['access_token'],
      ...user,
    });
  }
}
