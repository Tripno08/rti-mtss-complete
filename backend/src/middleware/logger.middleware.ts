import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    
    // Registrar o início da requisição
    this.logger.log(
      `${method} ${originalUrl} - ${ip} - ${userAgent}`
    );

    // Capturar o timestamp de início
    const startTime = Date.now();

    // Quando a resposta for enviada
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const responseTime = Date.now() - startTime;

      // Registrar informações da resposta
      if (statusCode >= 400) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms - ${contentLength} - ${ip} - ${userAgent}`
        );
      } else if (statusCode >= 300) {
        this.logger.warn(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms - ${contentLength} - ${ip} - ${userAgent}`
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${responseTime}ms - ${contentLength} - ${ip} - ${userAgent}`
        );
      }
    });

    next();
  }
} 