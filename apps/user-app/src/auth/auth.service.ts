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

  async findOne(id): Promise<Auth> {
    return this.authRepository.findOneOrFail({
      id,
    });
  }
  async findOneOrCreate(provider: number, socialId: string): Promise<Auth> {
    return this.authRepository
      .findOne({ provider, socialId })
      .then((auth) => (auth ? auth : this.create(provider, socialId)));
  }

  async createToken(user: User): Promise<string[]> {
    const prom = await new Promise((res, _) => {
      res([
        jwt.sign({ ...user }, process.env.JWT_AUTH_SECRET, {
          expiresIn: '10m',
          algorithm: 'HS256',
        }),
        jwt.sign({ ...user }, process.env.JWT_AUTH_REFRESH_SECRET, {
          expiresIn: '10H',
          algorithm: 'HS512',
        }),
      ]);
    }).then((d: string[]) => d);
    return prom;
  }

  async decodeToken(token: string) {
    try {
      const prom = await new Promise((res, _) => {
        res(jwt.verify(token, process.env.JWT_AUTH_SECRET));
      }).then((d: IJwtPayLoad) => d);
      return prom;
    } catch (err) {
      if (isInstance(err, jwt.TokenExpiredError))
        throw new UnauthorizedException('Expired');
      throw isInstance(err, jwt.JsonWebTokenError)
        ? new BadRequestException('Wrong Token!')
        : new ImATeapotException('No Idea');
    }
  }

  async decodeRefreshToken(token: string) {
    try {
      const prom = await new Promise((res, _) => {
        res(jwt.verify(token, process.env.JWT_AUTH_REFRESH_SECRET));
      }).then((d: IJwtPayLoad) => d);
      return prom;
    } catch (err) {
      if (isInstance(err, jwt.TokenExpiredError))
        throw new UnauthorizedException('Expired');
      throw isInstance(err, jwt.JsonWebTokenError)
        ? new BadRequestException('Wrong Token')
        : new ImATeapotException('No Idea');
    }
  }
  async getUserToken(id: string) {
    //
  }
}
