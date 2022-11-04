import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { KnexModule } from 'nestjs-knex';
import * as config from '../knexfile';

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: () => ({
        config: config[process.env.NODE_ENV ?? 'development'],
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
