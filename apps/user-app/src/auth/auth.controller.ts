import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  Patch,
  ImATeapotException,
  Delete,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SocialService } from '../social/social.service';
import { S3Service } from '../s3/s3.service';
import { UsersService } from '../users/users.service';
import { BlockService } from '../block/block.service';
import { ReportService } from '../report/report.service';
import { SocialTokenDto } from './dto/social-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateReportDto } from '../report/dto/create-report.dto';
import { CreateBlockDto } from '../block/dto/create-block.dto';
import { DeleteBlockDto } from '../block/dto/delete-block.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly reportService: ReportService,
    private readonly socialService: SocialService,
    private readonly blockService: BlockService,
    private readonly s3Service: S3Service,
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
    const [socialToken, socialRefreshToken] = await this.socialService.getToken(
      code,
    );
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
    this.reportService.isValid(user.id);
    const [accessToken, refreshToken] = await this.authService.createToken(
      user,
    );
    if (accessToken && refreshToken)
      return res.status(201).json({
        user,
        accessToken,
        refreshToken,
        socialToken: socialToken,
        socialRefreshToken: socialRefreshToken,
      });
  }

  @Post('auth/refresh')
  async refresh(@Res() res: Response, @Body() updateTokenDto: UpdateTokenDto) {
    const token =
      updateTokenDto.refreshToken.length != 56
        ? await this.authService.decodeRefreshToken(updateTokenDto.refreshToken)
        : await this.socialService.refreshToken(updateTokenDto.refreshToken);
    if (token) return res.status(201).json({ accessToken: token });
  }

  @Post('auth/signout')
  async signout(
    @Res() res: Response,
    @Headers('Authorization') accessToken: string,
    @Body() socialTokenDto: SocialTokenDto,
  ) {
    const { id } = await this.authService.decodeToken(accessToken);
    await this.socialService.unlink(socialTokenDto.accessToken);
    await this.authService.remove(id);
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

  @Post('user/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadedFile(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') accessToken: string,
  ) {
    if (file.size >= 3000000)
      throw new BadRequestException('File bigger than 3MB');
    const decoded = await this.authService.decodeToken(accessToken);

    const url = await this.s3Service.uploadFile(file, decoded.id);
    return res.status(HttpStatus.CREATED).send(url);
  }

  @Post('user/report')
  async report(
    @Res() res: Response,
    @Body() createReportDto: CreateReportDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const created = await this.reportService.create(
      decoded.id,
      createReportDto,
    );
    if (created) return res.status(201).json({ id: created.id });
  }

  @Post('user/block')
  async block(
    @Res() res: Response,
    @Body() createBlockDto: CreateBlockDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const created = await this.blockService.create(decoded.id, createBlockDto);
    if (created) return res.status(201).json({ id: created.id });
  }

  @Delete('user/block')
  async unblock(
    @Res() res: Response,
    @Body() deleteBlockDto: DeleteBlockDto,
    @Headers('Authorization') accessToken: string,
  ) {
    const decoded = await this.authService.decodeToken(accessToken);
    const deleted = await this.blockService.remove(decoded.id, deleteBlockDto);
    if (deleted.affected) return res.status(HttpStatus.OK).send();
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
  }
}
