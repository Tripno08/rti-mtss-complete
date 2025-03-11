import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Prefixo global para API
  app.setGlobalPrefix('api');
  
  // Configuração de CORS
  app.enableCors({
    origin: ['http://localhost:3002', 'http://127.0.0.1:3002'], // Permitir explicitamente o frontend
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    maxAge: 3600,
  });
  
  // Pipes de validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Configurar filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Porta do servidor
  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
  logger.log(`Aplicação rodando na porta ${port}`);
}
bootstrap();
