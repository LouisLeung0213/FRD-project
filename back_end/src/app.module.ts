import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PostsModule } from './posts/posts.module';
import { AdminModule } from './admin/admin.module';
import { StoragesModule } from './storages/storages.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfilesModule,
    PostsModule,
    AdminModule,
    StoragesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
