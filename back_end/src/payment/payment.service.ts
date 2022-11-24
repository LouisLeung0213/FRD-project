import { Injectable, Module, Res } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Stripe } from 'stripe';
import { env } from 'env';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { redirect } from 'react-router';

@Injectable()
export class PaymentService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async paymentIntent(createPaymentDto: CreatePaymentDto) {
    let amount = createPaymentDto.amount;

    const stripe = new Stripe(env.STRIPE_KEY, { apiVersion: '2022-11-15' });
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'hkd',
        payment_method_types: ['card'],
        payment_method_options: {
          card: {
            capture_method: 'manual',
          },
        },
      });

      console.log(paymentIntent.client_secret);
      return {
        client_secret: paymentIntent.client_secret,
      };
    } catch (error) {
      return { error: { message: error.message } };
    }
  }

  async sessionTest(createPaymentDto: CreatePaymentDto) {
    let amount = createPaymentDto.amount;
    const stripe = new Stripe(env.STRIPE_KEY, { apiVersion: '2022-11-15' });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'hkd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:4242/success',
      cancel_url: 'http://localhost:4242/cancel',
    });

    console.log('303', session.url);
    return session.url;
  }

  stripeConfig() {
    return { key: env.PUBLIC_STRIPE_KEY };
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
