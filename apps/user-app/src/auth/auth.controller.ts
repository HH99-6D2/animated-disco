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
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocialService } from '../social/social.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SocialTokenDto } from './dto/social-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateReportDto } from '../users/dto/create-report.dto';

@ApiTags('auth')
@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly socialService: SocialService,
  ) {}

  @Get('auth/login')
  async socialLogin(@Response() response, @Query('provider') provider: string) {
    const redirectUrl = this.socialService.getLoginUrl(provider);
    return response.status(302).redirect(redirectUrl);
  }

  @Get('auth/oauth')
  async oauth(@Query('code') code: string, @Query('error') error: string) {
    if (error)
      throw new UnauthorizedException('SocialProvider Agreement Exception');
    const socialToken = await this.socialService.getToken(code);
    const socialInfo = await this.socialService.getUserInfo(socialToken);
    const authUser = await this.authService.findOneOrCreate(
      1,
      socialInfo['data']['id'],
    );
    const nickname = socialInfo['data']['kakao_account']['nickname'];
    const user = await this.userService.findOneOrCreate(
      authUser.id,
      nickname && nickname.length >= 2 && nickname.length <= 16
        ? nickname
        : 'temp',
    );
    const [accessToken, refreshToken] = await this.authService.createToken(
      user,
    );
    return {
      user,
      socialToken: socialToken,
      accessToken,
      refreshToken,
    };
  }

  @Post('auth/refresh')
  async refresh(@Body() updateTokenDto: UpdateTokenDto) {
    const token = await this.authService.decodeRefreshToken(
      updateTokenDto.refreshToken,
    );
    return {
      accessToken: token,
    };
  }

  @Post('auth/signout')
  async signout(
    @Headers('Authorization') accessToken: string,
    @Body() socialTokenDto: SocialTokenDto,
  ) {
    await this.authService.decodeToken(accessToken);
    await this.socialService.unlink(socialTokenDto.accessToken);
    return HttpCode(200);
  }

  @Post('auth/logout')
  async logout(
    @Headers('Authorization') accessToken: string,
    @Body() socialTokenDto: SocialTokenDto,
  ) {
    await this.authService.decodeToken(accessToken);
    await this.socialService.logout(socialTokenDto.accessToken);
    return HttpCode(200);
  }

  @Patch('user/update')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const updated = await this.userService.update(decoded.id, updateUserDto);
    if (updated['affected'] === 1) return { id: decoded.id };
    throw new BadRequestException('Invalid Token, login required');
  }

  @Patch('user/report')
  async report(
    @Body() createReportDto: CreateReportDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const created = await this.userService.report(decoded.id, createReportDto);
    if (created) return { id: decoded.id };
    throw new BadRequestException('Invalid Token, login required');
  }
}
