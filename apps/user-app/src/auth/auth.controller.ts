import {
  Controller,
  Get,
  Query,
  Response,
  Post,
  Body,
  HttpCode,
  Headers,
  BadRequestException,
  UnauthorizedException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocialService } from '../social/social.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SocialTokenDto } from './dto/social-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@ApiTags('auth')
@Controller('api/auth')
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
  async oauth(
    @Response() response,
    @Query('code') code: string,
    @Query('error') error: string,
  ) {
    if (error)
      throw new UnauthorizedException('SocialProvider Agreement Exception');
    const socialToken = await this.socialService.getToken(code);
    const socialInfo = await this.socialService.getUserInfo(socialToken);
    const authUser = await this.authService.findOneOrCreate(
      1,
      socialInfo['data']['id'],
    );
    const user = await this.userService.findOneOrCreate(
      authUser.id,
      socialInfo['data']['kakao_account']['nickname'],
    );
    const [accessToken, refreshToken] = await this.authService.createToken(
      user,
    );
    return response.json({
      user,
      socialToken: socialToken,
      accessToken,
      refreshToken,
    });
  }

  @Post('refresh')
  async refresh(@Response() response, @Body() updateTokenDto: UpdateTokenDto) {
    const payload = await this.authService.decodeRefreshToken(
      updateTokenDto.refreshToken,
    );
    delete payload.iat;
    delete payload.exp;
    return response.status(201).json({
      accessToken: await this.authService.createToken(payload),
    });
  }

  @Post('update')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const updated = await this.userService.update(decoded.id, updateUserDto);
    return updated;
  }

  @Post('signout')
  async signout(
    @Headers('Authorization') accessToken: string,
    @Body() socialTokenDto: SocialTokenDto,
  ) {
    await this.authService.decodeToken(accessToken);
    await this.socialService.unlink(socialTokenDto.accessToken);
    return HttpCode(200);
  }

  @Post('logout')
  async logout(
    @Headers('Authorization') accessToken: string,
    @Body() socialTokenDto: SocialTokenDto,
  ) {
    await this.authService.decodeToken(accessToken);
    await this.socialService.logout(socialTokenDto.accessToken);
    return HttpCode(200);
  }
}
