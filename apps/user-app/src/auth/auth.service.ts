import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import { IJwtPayLoad } from './interfaces/jwt.interface';
import { isInstance } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
  ) {}

  async create(provider: number, socialId: string): Promise<Auth> {
    const createAuthDTO = new CreateAuthDto();
    createAuthDTO.provider = provider;
    createAuthDTO.socialId = socialId;
    const socialProfile = this.authRepository.create(createAuthDTO);
    return this.authRepository.save(socialProfile);
  }

  async findOneOrCreate(provider: number, socialId: string): Promise<Auth> {
    return this.authRepository
      .findOne({ where: { socialId, provider }, withDeleted: true })
      .then(async (auth) => {
        if (!auth) return this.create(provider, socialId);
        if (auth.unlinkedAt) {
          auth.unlinkedAt = null;
          await this.authRepository.save(auth);
        }
        return auth;
      });
  }

  async update(id: number, refreshToken: string): Promise<UpdateResult> {
    return this.authRepository.update(id, {
      refreshToken: refreshToken || null,
    });
  }

  async createToken(user: User | IJwtPayLoad): Promise<string[]> {
    const prom = await new Promise((res, _) => {
      res([
        jwt.sign({ id: user.id }, process.env.JWT_AUTH_SECRET, {
          expiresIn: '30m',
          algorithm: 'HS256',
        }),
        jwt.sign({ id: user.id }, process.env.JWT_AUTH_REFRESH_SECRET, {
          expiresIn: '2d',
          algorithm: 'HS512',
        }),
      ]);
    }).then((d: string[]) => d);
    return prom;
  }

  async decodeToken(token: string) {
    token = this.parseToken(token);
    try {
      const prom = await new Promise((res, _) => {
        res(jwt.verify(token, process.env.JWT_AUTH_SECRET));
      }).then((d: IJwtPayLoad) => d);
      return prom;
    } catch (err) {
      if (isInstance(err, jwt.TokenExpiredError))
        throw new UnauthorizedException('Expired');
      throw isInstance(err, jwt.JsonWebTokenError)
        ? new BadRequestException(err.message || 'Wrong Token Value')
        : new ImATeapotException('No Idea');
    }
  }

  async findOneOrFail(id: number) {
    return this.authRepository.findOneOrFail(id);
  }
  async decodeRefreshToken(token: string) {
    token = this.parseToken(token);
    try {
      const payload = await new Promise((res, _) => {
        res(jwt.verify(token, process.env.JWT_AUTH_REFRESH_SECRET));
      }).then(async (d: IJwtPayLoad) => {
        const { refreshToken } = await this.findOneOrFail(d.id);
        if (refreshToken !== token)
          throw new UnauthorizedException(
            'RefreshToken Invalid, please login back.',
          );
        return jwt.sign({ id: d.id }, process.env.JWT_AUTH_SECRET, {
          expiresIn: '30m',
          algorithm: 'HS256',
        });
      });
      return payload;
    } catch (err) {
      if (isInstance(err, jwt.TokenExpiredError))
        throw new UnauthorizedException(
          err.message || 'Expired, login back required',
        );
      throw isInstance(err, jwt.JsonWebTokenError)
        ? new BadRequestException('Wrong Token Value')
        : new BadRequestException(err.message);
    }
  }

  async remove(id: number) {
    return this.authRepository.softDelete(id);
  }

  parseToken(tokenString: string) {
    let noBearer = false;
    try {
      noBearer = tokenString.indexOf('Bearer ') !== 0;
    } catch (err) {
      throw new UnauthorizedException('no Auth Included');
    }
    if (noBearer) throw new jwt.JsonWebTokenError('Wrong Token Type');
    return tokenString.split('Bearer ')[1];
  }
}
