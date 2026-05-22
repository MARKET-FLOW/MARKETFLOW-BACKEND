/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import redoc from 'redoc-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // activation auto validation swagger
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle('MARKET-FLOW API Documentation')
    .setDescription(
      'Notre application backend de gestion et suivi des ventes de produits',
    )
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // redoc configuration
  app.use(
    'redocs',
    redoc({
      title: 'MARKET-FLOW API Documentation',
      specUrl: '/docs-json',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
