import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import axios from 'axios';
import { stringify } from 'qs';
import { KakaoToken } from './interfaces/social-token.interface';
import { kakaoSocialData } from './interfaces/social-data.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    let auth;
    const provider = createAuthDto.provider == 'kakao' ? 1 : 0;
    try {
      auth = await this.authRepository.findOne({
        socialId: createAuthDto.socialId,
        provider: provider,
      });
    } catch (err) {
      auth = await this.authRepository.create({
        socialId: createAuthDto.socialId,
        provider: provider,
        email: createAuthDto.email || null,
      });
    } finally {
      return auth;
    }
  }

  async findOne(socialId: number, provider: string) {
    const auth = await this.authRepository.findOneOrFail({
      socialId: socialId,
      provider: provider === 'kakao' ? 1 : 2,
    });
    return auth;
  }

  async getSocialInfo(token: KakaoToken): Promise<kakaoSocialData> {
    //scope: 'account_email profile_image profile_nickname';
    const { data } = await axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    return data;
  }

  async getSocialToken(code: string): Promise<KakaoToken> {
    const { data } = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URL,
        code: code,
      }),
    });
    return data;
  }
}
