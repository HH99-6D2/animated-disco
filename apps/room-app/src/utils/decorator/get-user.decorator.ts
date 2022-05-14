import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authorization = request.headers.authorization;
  const token = authorization.split(' ')[1];
  let user;
  
  try {
    user = jwt.verify(token, process.env.JWT_AUTH_SECRET);
  } catch (err) {
    throw new UnauthorizedException(err);
  }
  return user;
});
