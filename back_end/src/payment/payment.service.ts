import { Injectable, Module, Res } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePointsDto } from './dto/update-payment.dto';
import { Stripe } from 'stripe';
import { env } from 'env';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { redirect } from 'react-router';

@Injectable()
export class PaymentService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async paymentIntent(createPaymentDto: CreatePaymentDto) {
    const stripe = new Stripe(env.STRIPE_KEY, { apiVersion: '2022-11-15' });
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: createPaymentDto.amount + +'00',
        currency: 'hkd',
        payment_method_types: ['card'],
        // automatic_payment_methods: {
        //   enabled: true,
        // },
        payment_method_options: {
          card: {
            capture_method: 'manual',
          },
        },
      });
      paymentIntent.payment_method = 'processing';

      console.log(paymentIntent.client_secret);
      return {
        result: paymentIntent,
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

  async addPoints(updatePointsDto: UpdatePointsDto) {
    const { points, userId } = updatePointsDto;
    let result = await this.knex('users').select('points').where('id', userId);
    console.log(result[0]);
    let remainPoints = result[0];
    let totalPoint = remainPoints + +points;
    let addPoints = await this.knex('users')
      .update({
        points: totalPoint,
      })
      .where('id', userId);

    return {
      message: `${addPoints} is already add to user: ${userId}`,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
