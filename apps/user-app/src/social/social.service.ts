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
  async getUserInfo(accessToken: string) {
    return axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async getToken(code: string) {
    return axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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
  async logout(socialToken: string) {
    return axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v1/user/logout',
      headers: {
        Authorization: `Bearer ${socialToken}`,
      },
    });
  }
  async unlink(socialToken: string) {
    return axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v1/user/unlink',
      headers: {
        Authorization: `Bearer ${socialToken}`,
      },
    });
  }
}
