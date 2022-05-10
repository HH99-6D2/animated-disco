import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import axios from 'axios';
import { stringify } from 'qs';
import { IKakaoTokenData } from './interfaces/social-token-data.interface';
import { IkakaoSocialData } from './interfaces/social-data.interface';
import { IAuthCreateData } from './interfaces/auth-data.interface';
import { UsersService } from '../users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private usersService: UsersService,
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
    const { data } = await axios({
      method: 'POST',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    return data;
  }
  async getTokenInfo(accessToken: string): Promise<any> {
    console.log('accTOKEN', accessToken);
    const data = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v1/user/access_token_info',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(data);
    return data;
  }

  async getSocialToken(code: string): Promise<any> {
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

  async validateUser(loginAuthDto: LoginAuthDto): Promise<any> {
    const { accessToken, id } = loginAuthDto;
    const { data } = await this.getTokenInfo(accessToken);
    const user = await this.usersService.findOne(id);
    const socialProfile = await this.authRepository.findOne(id);
    if (socialProfile.socialId !== `${data.id}` || !user)
      throw new BadRequestException();
    if (!user.isActive) throw new ForbiddenException();
    return user;
  }

  async createToken(user: User) {
    const prom = new Promise((res, _) => {
      res(
        jwt.sign({ ...user }, process.env.JWT_AUTH_SECRET, {
          expiresIn: '12h',
          algorithm: 'HS256',
        }),
      );
    }).then((d) => d);
    const token = await prom;
    return token;
  }

  async decodeToken(token) {
    const prom = new Promise((res, _) => {
      res(jwt.verify(token, process.env.JWT_AUTH_SECRET));
    }).then((d) => d);

    const payload = await prom;
    return payload;
  }
}
