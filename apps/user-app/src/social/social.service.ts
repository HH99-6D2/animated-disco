import {
  Injectable,
  NotAcceptableException,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios from 'axios';
import { stringify } from 'qs';

@Injectable()
export class SocialService {
  getLoginUrl(provider: string) {
    if (provider === 'kakao')
      return `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&response_type=code&scope=profile_nickname`;
    else throw new NotAcceptableException('social provider kakao only');
  }

  async getUserInfo(accessToken: string) {
    try {
      return await axios({
        method: 'POST',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      throw new ServiceUnavailableException('social Service UnAvailable');
    }
  }

  async getToken(code: string) {
    try {
      const socialToken = await axios({
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
      return socialToken['data']['access_token'];
    } catch (err) {
      throw new ServiceUnavailableException('social Service UnAvailable');
    }
  }
  async logout(socialToken: string) {
    try {
      return await axios({
        method: 'POST',
        url: 'https://kapi.kakao.com/v1/user/logout',
        headers: {
          Authorization: `Bearer ${socialToken}`,
        },
      });
    } catch (err) {
      throw new ServiceUnavailableException('social Service UnAvailable');
    }
  }
  async unlink(socialToken: string) {
    try {
      return await axios({
        method: 'POST',
        url: 'https://kapi.kakao.com/v1/user/unlink',
        headers: {
          Authorization: `Bearer ${socialToken}`,
        },
      });
    } catch (err) {
      throw new ServiceUnavailableException('social Service UnAvailable');
    }
    // TODO Unlink Target User on db.
  }
}
