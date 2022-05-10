import {
  Controller,
  Get,
  Query,
  HttpCode,
  Response,
  Request,
  NotAcceptableException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserCreateData } from '../users/interfaces/create-user.interface';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { IAuthCreateData } from './interfaces/auth-data.interface';

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

  @Get('oauth')
  async oauth(
    @Request() req,
    @Query('code') code: string,
    @Query('error') error: string,
  ) {
    if (error) return HttpCode(500);

    const authToken = await this.authService.getSocialToken(code);
    const { id, kakao_account, properties } =
      await this.authService.getSocialInfo(authToken);
    console.log(kakao_account, properties);
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
    req.headers.Authorization = `Bearer ${authToken.access_token}`;
    return userData;
    /*
    } else await this.userService.findOne(socialProfile.id);
    //return await this.authService.createToken(user);
    */
  }
}
