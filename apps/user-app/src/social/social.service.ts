import { Injectable, NotAcceptableException } from '@nestjs/common';
import axios from 'axios';
import { stringify } from 'qs';

@Injectable()
export class SocialService {
  getLoginUrl(provider: string) {
    if (provider === 'kakao')
      return `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code&scope=profile_nickname,account_email,profile_image`;
    else throw new NotAcceptableException('social provider kakao only');
  }
  async getSocialInfo(accessToken: string): Promise<unknown> {
    return axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async getSocialTokenInfo(accessToken: string): Promise<unknown> {
    return axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v1/user/access_token_info',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async getSocialToken(code: string) {
    return axios({
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
  }
}
