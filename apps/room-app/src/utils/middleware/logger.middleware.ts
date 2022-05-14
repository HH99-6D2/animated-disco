import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('Log');
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.verbose(
      `${req.method} - ${req.originalUrl}, query: ${JSON.stringify(req.query)}, body: ${JSON.stringify(req.body)}`,
    );
    next();
  }
}
