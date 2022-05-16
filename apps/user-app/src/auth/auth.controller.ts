import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  HttpCode,
  Headers,
  UnauthorizedException,
  Patch,
  ImATeapotException,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocialService } from '../social/social.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SocialTokenDto } from './dto/social-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateReportDto } from '../users/dto/create-report.dto';
import { CreateBlockDto } from '../users/dto/create-block.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly socialService: SocialService,
  ) {}

  @Get('auth/login')
  async socialLogin(@Res() res: Response, @Query('provider') provider: string) {
    const redirectUrl = this.socialService.getLoginUrl(provider);
    return res.status(302).redirect(redirectUrl);
  }

  @Get('auth/oauth')
  async oauth(
    @Res() res: Response,
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
    if (accessToken && refreshToken)
      return res.status(201).json({
        user,
        socialToken: socialToken,
        accessToken,
        refreshToken,
      });
    throw new ImATeapotException('Unknown Error');
  }

  @Post('auth/refresh')
  async refresh(@Res() res: Response, @Body() updateTokenDto: UpdateTokenDto) {
    const token = await this.authService.decodeRefreshToken(
      updateTokenDto.refreshToken,
    );
    if (token) return res.status(201).json({ accessToken: token });
    throw new ImATeapotException('Unknown Error');
  }

  @Post('auth/signout')
  async signout(
    @Res() res: Response,
    @Headers('Authorization') accessToken: string,
    @Body() socialTokenDto: SocialTokenDto,
  ) {
    await this.authService.decodeToken(accessToken);
    await this.socialService.unlink(socialTokenDto.accessToken);
    return res.status(200).send();
  }

  @Post('auth/logout')
  async logout(
    @Res() res: Response,
    @Headers('Authorization') accessToken: string,
    @Body() socialTokenDto: SocialTokenDto,
  ) {
    await this.authService.decodeToken(accessToken);
    await this.socialService.logout(socialTokenDto.accessToken);
    return res.status(200).send();
  }

  @Patch('user/update')
  async update(
    @Res() res: Response,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const updated = await this.userService.update(decoded.id, updateUserDto);
    if (updated.affected === 1) return res.status(HttpStatus.OK).send();
    throw new ImATeapotException('Unknown Error, Not created');
  }

  @Post('user/report')
  async report(
    @Res() res: Response,
    @Body() createReportDto: CreateReportDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const created = await this.userService.report(decoded.id, createReportDto);
    if (created) return res.status(201).json({ id: created.id });
    throw new ImATeapotException('Unknown Error, Not created');
  }

  @Post('user/block')
  async block(
    @Res() res: Response,
    @Body() createBlockDto: CreateBlockDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const created = await this.userService.createBlock(
      decoded.id,
      createBlockDto,
    );
    if (created) return res.status(201).json({ id: created.id });
    throw new ImATeapotException('Unknown Error, Not created');
  }

  @Delete('user/block')
  async unblock(
    @Res() res: Response,
    @Body() createBlockDto: CreateBlockDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const deleted = await this.userService.deleteBlock(
      decoded.id,
      createBlockDto,
    );
    if (deleted.affected) return res.status(HttpStatus.OK).send();
    throw new ImATeapotException('Unknown Error, Not deleted');
  }
  @Get('user/info')
  async info(
    @Res() res: Response,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const user = await this.userService.findOne(decoded.id);
    user.blockUsers = user.blockUsers.map((blockInfo) => blockInfo.user['id']);
    if (user) return res.status(200).json(user);
    throw new ImATeapotException('Unknown Error');
  }
}
