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
import { ChatroomModule } from './chatroom/chatroom.module';
import { PaymentModule } from './payment/payment.module';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { BidModule } from './bid/bid.module';
import { InformationModule } from './information/information.module';

const firebaseConfig = {
  apiKey: 'AIzaSyD243djxwnLoP4tSfW0CUqOlE-3z0UQGL4',
  authDomain: 'test-6e6e8.firebaseapp.com',
  projectId: 'test-6e6e8',
  storageBucket: 'test-6e6e8.appspot.com',
  messagingSenderId: '541343843596',
  appId: '1:541343843596:web:7f5af8f2e7113d68a53529',
  measurementId: 'G-35MBSYNCVH',
};

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProfilesModule,
    PostsModule,
    AdminModule,
    StoragesModule,
    InvoiceModule,
    ChatroomModule,
    //StripeModule.forRoot(env.STRIPE_KEY, { apiVersion: '2022-11-15' }),
    StripeModule.forRoot(env.STRIPE_KEY, { apiVersion: '2022-11-15' }),
    PaymentModule,
    BidModule,
    InformationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
