import {
  BadRequestException,
  ForbiddenException,
  ImATeapotException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/entities/user.entity';
import { IJwtPayLoad } from './interfaces/jwt.interface';
import { isInstance } from 'class-validator';

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
    const socialProfile = this.authRepository.create(createAuthDTO);
    return this.authRepository.save(socialProfile);
  }

  async findOne(provider: number, socialId: string): Promise<Auth> {
    return this.authRepository.findOneOrFail({
      socialId,
      provider,
    });
  }
  async findOneOrCreate(provider: number, socialId: string): Promise<Auth> {
    console.log(provider, socialId);
    return this.authRepository
      .findOne({ provider, socialId })
      .then((auth) => (auth ? auth : this.create(provider, socialId)));
  }

  async validateUser(id: number, socialId: string): Promise<any> {
    const user = await this.usersService.findOne(id);
    const socialProfile = await this.authRepository.findOne(id);
    if (socialProfile.socialId !== socialId) throw new BadRequestException();
    if (!user.isActive) throw new ForbiddenException();
    return user;
  }

  async createToken(user: User, accessToken: string): Promise<unknown> {
    const prom = new Promise((res, _) => {
      res(
        jwt.sign({ ...user, accessToken }, process.env.JWT_AUTH_SECRET, {
          expiresIn: '2h',
          algorithm: 'HS256',
        }),
      );
    }).then((d: string) => d);
    const token = await prom;
    return token;
  }

  async decodeToken(token: string) {
    try {
      const prom = await new Promise((res, _) => {
        res(jwt.verify(token, process.env.JWT_AUTH_SECRET));
      }).then((d: IJwtPayLoad) => d);
      return prom;
    } catch (err) {
      console.log(err);
      if (isInstance(err, jwt.TokenExpiredError))
        throw new UnauthorizedException('Expired');
      throw isInstance(err, jwt.JsonWebTokenError)
        ? new BadRequestException('Wrong Token')
        : new ImATeapotException('No Idea');
    }
  }
}
