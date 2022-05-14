import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  ImATeapotException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { isInstance } from 'class-validator';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (authorization == null) {
      return false;
    } else {
      return this.decodeToken(authorization);
    }
  }

  decodeToken(authorization: string): boolean {
    const token = authorization.split(' ');
    if (token.length < 2) {
      return false;
    } else if (token[0] !== 'Bearer') {
      return false;
    } else {
      return true;
    }
  }
}
