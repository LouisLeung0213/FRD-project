import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from 'env';
import helmet from 'helmet';
import { print } from 'listening-on';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    // origin: 'https://app.example.com',
  });
  await app.listen(env.PORT, () => {
    print(+env.PORT);
  });
}
bootstrap();
