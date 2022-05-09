import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import axios from 'axios';

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

  async requestUserInfo(code: string) {
    const token = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirectUri: process.env.redirectUri,
        code: code,
      }),
    });
    const { data } = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      },
    });
    return data;
  }
  async createToken(loginUser) {
    return 'TOKEN';
  }
}
