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

  @Get('oauth')
  async oauth(@Response() response, @Query('code') code: string) {
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
      user,
      accessToken: await this.authService.createToken(
        user,
        token['data']['access_token'],
      ),
    });
  }

  @Post('logout')
  async logout(@Body() loginAuthDto: LoginAuthDto) {
    const decoded = await this.authService.decodeToken(
      loginAuthDto.accessToken,
    );
    const { accessToken } = decoded;
    if (loginAuthDto.id !== decoded.id) return 'WRONG DATA';
    const result = await this.socialService.logout(accessToken);
    console.log(result.status, result.statusText);
    return 'logout';

    //    const user = await this.authService.decodeToken(loginAuthDto.accessToken);
    //   await this.socialService.logout(loginAuthDto.accessToken);
  }

  @Post('refresh')
  async refresh(@Response() response, @Body() loginAuthDto: LoginAuthDto) {
    const decoded = await this.authService.decodeToken(
      loginAuthDto.accessToken,
    );
    let { accessToken } = decoded;
    delete decoded.accessToken;
    delete decoded.iat;
    delete decoded.exp;
    console.log(decoded);
    console.log(accessToken);
    return response.json({
      accessToken: await this.authService.createToken(decoded, accessToken),
    });
  }

  @Post('checkLogin')
  async checkLogin(@Body() loginAuthDto: LoginAuthDto) {
    const decoded = await this.authService.decodeToken(
      loginAuthDto.accessToken,
    );
    const { accessToken } = decoded;
    console.log(decoded, accessToken);
    if (loginAuthDto.id !== decoded.id) return 'WRONG DATA';
    const result = await this.socialService.getTokenInfo(accessToken);
    console.log(result.status, result.statusText);
    return 'islogin';
  }

  @Post('signout')
  async signout(@Body() loginAuthDto: LoginAuthDto) {
    const decoded = await this.authService.decodeToken(
      loginAuthDto.accessToken,
    );
    const { accessToken } = decoded;
    console.log(decoded, accessToken);
    if (loginAuthDto.id !== decoded.id) return 'WRONG DATA';

    const result = await this.socialService.unlink(accessToken);
    console.log(result.status, result.statusText);
    return 'logout';
    //    const user = await this.authService.decodeToken(loginAuthDto.accessToken);
    //   await this.socialService.logout(loginAuthDto.accessToken);
  }
}
