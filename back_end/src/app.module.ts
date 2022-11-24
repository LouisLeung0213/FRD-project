import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PostsModule } from './posts/posts.module';
import { AdminModule } from './admin/admin.module';
import { StoragesModule } from './storages/storages.module';
import { InvoiceModule } from './invoice/invoice.module';
import { StripeModule } from './stripe/stripe.module';
import { env } from 'process';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfilesModule,
    PostsModule,
    AdminModule,
    StoragesModule,
    InvoiceModule,
    StripeModule.forRoot(env.STRIPE_KEY, { apiVersion: '2022-11-15' }),
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
