import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import redoc from 'redoc-express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // Filtre global — toutes les exceptions non catchées retournent { success, result, error }
  app.useGlobalFilters(new GlobalExceptionFilter());

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
    .addBearerAuth() // préparé pour JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // redoc configuration
  app.use(
    '/redocs',
    redoc({
      title: 'MARKET-FLOW API Documentation',
      specUrl: '/docs-json',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
