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
import { IUserCreateData } from '../users/interfaces/create-user.interface';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { IAuthCreateData } from './interfaces/auth-data.interface';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get('social/login')
  socialLogin(@Response() response, @Query('provider') provider: string) {
    if (provider === 'kakao')
      return response
        .status(302)
        .redirect(
          `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code&scope=profile_nickname,account_email,profile_image`,
        );
    else throw new NotAcceptableException();
  }

  @Get('social/oauth')
  async oauth(
    @Response() response,
    @Query('code') code: string,
    @Query('error') error: string,
  ) {
    if (error) return HttpCode(500);

    const authToken = await this.authService.getSocialToken(code);
    const { id, kakao_account, properties } =
      await this.authService.getSocialInfo(authToken);
    const authCreateData: IAuthCreateData = {
      provider: 1,
      socialId: id,
      email: kakao_account.email,
    };
    let socialProfile = await this.authService.findOne(authCreateData);
    const userData: IUserCreateData = {
      id: socialProfile.id,
      nickname: properties.nickname || null,
      imageUrl: properties.profile_image || null,
    };

    if (!socialProfile) {
      socialProfile = await this.authService.create(authCreateData);
      userData.id = socialProfile.id;
      await this.userService.create(userData);
    }

    return response.json({ accessToken: authToken.access_token, ...userData });
  }

  @Post('login')
  async login(@Response() response, @Body() loginAuthDto: LoginAuthDto) {
    const user = await this.authService.validateUser(loginAuthDto);
    const token = await this.authService.createToken(user);
    // const decoded = await this.authService.decodeToken(token);
    return response.set({ Authorization: `Bearer ${token}` }).json(user);
  }
}
