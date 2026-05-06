import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import redoc from 'redoc-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
