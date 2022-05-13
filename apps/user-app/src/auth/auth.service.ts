import {
  BadRequestException,
  ImATeapotException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    return this.authRepository.findOne({ provider, socialId }).then((auth) => {
      if (!auth) return this.create(provider, socialId);
      auth.unlinkedAt = null;
      this.authRepository.save(auth);
      return auth;
    });
  }

  async createToken(user: User | IJwtPayLoad): Promise<string[]> {
    delete user['isActive'];
    const prom = await new Promise((res, _) => {
      res([
        jwt.sign({ ...user }, process.env.JWT_AUTH_SECRET, {
          expiresIn: '10m',
          algorithm: 'HS256',
        }),
        jwt.sign({ ...user }, process.env.JWT_AUTH_REFRESH_SECRET, {
          expiresIn: '12h',
          algorithm: 'HS512',
        }),
      ]);
    }).then((d: string[]) => d);
    return prom;
  }

  async decodeToken(token: string) {
    try {
      token = this.parseToken(token);
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

  async decodeRefreshToken(token: string) {
    try {
      token = this.parseToken(token);
      const payload = await new Promise((res, _) => {
        res(jwt.verify(token, process.env.JWT_AUTH_REFRESH_SECRET));
      }).then((d: IJwtPayLoad) => {
        delete d.exp;
        delete d.iat;
        return jwt.sign(d, process.env.JWT_AUTH_SECRET, {
          expiresIn: '10m',
          algorithm: 'HS256',
        });
      });
      return payload;
    } catch (err) {
      if (isInstance(err, jwt.TokenExpiredError))
        throw new UnauthorizedException(err.message || 'Expired');
      throw isInstance(err, jwt.JsonWebTokenError)
        ? new BadRequestException(err.message || 'Wrong Token Value')
        : new ImATeapotException('No Idea');
    }
  }

  parseToken(tokenString: string) {
    if (!tokenString) throw new jwt.JsonWebTokenError('not JWT');
    if (tokenString.indexOf('bearer ') !== 0)
      throw new jwt.JsonWebTokenError('Wrong Token Type');
    return tokenString.split('bearer ')[1];
  }
}
