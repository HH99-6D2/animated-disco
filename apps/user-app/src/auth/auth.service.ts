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

  async create(provider: number, socialId: string): Promise<Auth> {
    const createAuthDTO = new CreateAuthDto();
    createAuthDTO.provider = provider;
    createAuthDTO.socialId = socialId;
    const auth = this.authRepository.create(createAuthDTO);
    return this.authRepository.save(auth);
  }

  async findOne(provider: number, socialId: string): Promise<Auth> {
    return this.authRepository.findOneOrFail({
      socialId,
      provider,
    });
  }
  async findOneOrCreate(provider: number, socialId: string): Promise<Auth> {
    return this.authRepository
      .findOne({ provider, socialId })
      .then((auth) => (auth ? auth : this.create(provider, socialId)));
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

  async getTokenInfo(accessToken: string): Promise<unknown> {
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

  async validateUser(loginAuthDto: LoginAuthDto): Promise<any> {
    const { accessToken, id } = loginAuthDto;
    const data = await this.getTokenInfo(accessToken);
    const user = await this.usersService.findOne(id);
    const socialProfile = await this.authRepository.findOne(id);
    if (socialProfile.socialId !== `${data['id']}` || !user)
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
