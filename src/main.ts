import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Restaurant Management API')
    .setDescription('APIs for restaurants, users and recommendations')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_PATH || '/api/docs', app, doc);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`App running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}${process.env.SWAGGER_PATH || '/api/docs'}`);
}
bootstrap();
