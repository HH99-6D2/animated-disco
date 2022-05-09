import { Controller, Get, Post, Query, HttpCode, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

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

    const authToken = await this.authService.getSocialToken(code);
    const userData = await this.authService.getSocialInfo(authToken);
    let socialProfile = await this.authService.findOne(userData.id, 1);
    if (!socialProfile) {
      const createAuthDTO = new CreateAuthDto();
      createAuthDTO.provider = 1;
      createAuthDTO.socialId = userData.id;
      createAuthDTO.email = userData.kakao_account.email || null;
      socialProfile = await this.authService.create(createAuthDTO);
      const createUserDTO = new CreateUserDto();
      createUserDTO.id = socialProfile.id;
      createUserDTO.nickname = userData.properties.nickname || null;
      createUserDTO.imageUrl = userData.properties.profile_image || null;
      return await this.userService.create(createUserDTO);
    } else return await this.userService.findOne(socialProfile.id);
    //return await this.authService.createToken(user);
  }

  @Post('logout')
  logout() {
    return 'logout!';
  }
}
