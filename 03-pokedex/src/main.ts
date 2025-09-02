import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  app.setGlobalPrefix('api/v2')

  await app.listen(process.env.PORT!);
}
bootstrap();

//WARN: Your at video 7, 9.Variables de Entorno
// mongodb+srv://<db_username>:<db_password>@luisinho-db.yp9i8.mongodb.net/
