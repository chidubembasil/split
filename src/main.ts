import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }),);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://app.yourdomain.com',
      'https://admin.yourdomain.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // only if you use cookies; not needed for Bearer tokens
    maxAge: 86400,
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
