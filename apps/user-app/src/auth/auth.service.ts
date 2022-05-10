import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import axios from 'axios';
import { stringify } from 'qs';
import { IKakaoTokenData } from './interfaces/social-token-data.interface';
import { IkakaoSocialData } from './interfaces/social-data.interface';
import { IAuthCreateData } from './interfaces/auth-data.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  async create(authCreateData: IAuthCreateData) {
    const createAuthDTO = new CreateAuthDto();
    createAuthDTO.provider = authCreateData.provider || 1;
    createAuthDTO.socialId = authCreateData.socialId;
    createAuthDTO.email = authCreateData.email || null;
    const auth = this.authRepository.create(createAuthDTO);
    return await this.authRepository.save(auth);
  }

  async findOne(authfindData: IAuthCreateData): Promise<Auth> {
    const auth = await this.authRepository.findOne({
      socialId: authfindData.socialId,
      provider: authfindData.provider,
    });
    return auth;
  }

  async getSocialInfo(token: IKakaoTokenData): Promise<IkakaoSocialData> {
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
  async getTokenInfo(token: IKakaoTokenData): Promise<any> {
    const data = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v1/access_token_info',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    return data;
  }

  async getSocialToken(code: string): Promise<IKakaoTokenData> {
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
