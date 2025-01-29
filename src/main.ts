import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // disableErrorMessages: true,
    }),
  );

  app.use('/upload', express.static(join(process.cwd(), 'upload')));

  const config = new DocumentBuilder()
    .setTitle('Nest')
    .setDescription('The may-2024 API description')
    .setVersion('1.0')
    .addTag('okten')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
