import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { env } from 'env';
import helmet from 'helmet';
import { print } from 'listening-on';
import * as socketIO from 'socket.io';
import { setIO } from './io';
import { BidController } from './bid/bid.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    //   // origin: 'https://app.example.com',
  });
  const server = await app.listen(env.PORT);
  const io = new socketIO.Server(server, { cors: { origin: '*' } });
  setIO(io);
  BidController.instance.setupIO(io);
  print(+env.PORT);
}
bootstrap();
