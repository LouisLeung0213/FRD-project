import { Injectable, Module, Res } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePointsDto } from './dto/update-points.dto';
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
        amount: createPaymentDto.amount,
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

  async capturePaymentIntent(updatePointsDto: UpdatePointsDto) {
    console.log('I am here', updatePointsDto);
    let required_amount = +updatePointsDto.bidPrice;
    const stripe = new Stripe(env.STRIPE_KEY, { apiVersion: '2022-11-15' });

    let buyer_origin_points_result = await this.knex('users')
      .select('points')
      .where('id', updatePointsDto.bidder_id);

    let buyer_origin_points: number = buyer_origin_points_result[0].points;
    let new_points = buyer_origin_points - required_amount;
    if (new_points < 0) {
      return { status: 99, message: "your account didn't have enough money" };
    }

    let held_intent = await this.knex('client_secrets')
      .select('*')
      .where('user_id', updatePointsDto.bidder_id)
      .andWhere('captured', false);
    //console.log(held_intent);
    let total_intent_should_capture = [];
    let amount_should_capture = 0;
    console.log('held_intent: ', held_intent);
    for (let intent of held_intent) {
      console.log('here I am  charge_amount,', required_amount);
      try {
        if (required_amount > intent.amount) {
          amount_should_capture = intent.amount;
          total_intent_should_capture.push({
            id: intent.id,
            client_secret_should_capture: `${intent.client_secret}`,
            amount_should_capture: amount_should_capture,
          });
          required_amount = required_amount - intent.amount;
          console.log(
            '>:',
            'required_amount: ',
            required_amount,
            'amount_should_capture: ',
            amount_should_capture,
            'intent.client_secret:',
            intent.client_secret,
          );
          console.log('text');
        } else if (required_amount == intent.amount) {
          amount_should_capture = intent.amount;
          total_intent_should_capture.push({
            id: intent.id,
            client_secret_should_capture: `${intent.client_secret}`,
            amount_should_capture: amount_should_capture,
          });
          required_amount = required_amount - intent.amount;

          console.log(
            '=:',
            required_amount,
            amount_should_capture,
            intent.client_secret,
          );
        } else if (required_amount < intent.amount) {
          let amount_should_remain = intent.amount - required_amount;
          amount_should_capture = intent.amount - amount_should_remain;
          total_intent_should_capture.push({
            id: intent.id,
            client_secret_should_capture: `${intent.client_secret}`,
            amount_should_capture: amount_should_capture,
          });
          required_amount = 0;
          console.log(
            '<:',
            'required_amount: ',
            required_amount,
            'amount_should_capture: ',
            amount_should_capture,
            'intent.client_secret:',
            intent.client_secret,
          );
        }

        if (required_amount == 0) {
          console.log('required_amount == 0');
          break;
        }
      } catch (error) {
        console.log(error);
      }
    }
    console.log('total_intent_should_capture:::', total_intent_should_capture);
    console.log('After forLoop required_amount: ', required_amount);
    let remain_capture = +updatePointsDto.bidPrice;
    try {
      for (let intent2 of total_intent_should_capture) {
        remain_capture = remain_capture - intent2.amount_should_capture;

        const result = await stripe.paymentIntents.capture(
          intent2.client_secret_should_capture,
          {
            amount_to_capture: intent2.amount_should_capture * 100,
          },
        );

        let captured_result = await this.knex('client_secrets')
          .update('captured', true)
          .where('client_secret', intent2.client_secret_should_capture);
        console.log('remain_capture?:', remain_capture);
        if (remain_capture == 0) {
          break;
        }
      }

      let intent_should_remain = held_intent.filter(
        (objA) =>
          total_intent_should_capture.filter((objB) => objA.id === objB.id)
            .length === 0,
      );

      console.log('intent_should_remain', intent_should_remain);
      let total_point_remain = 0;
      for (let obj of intent_should_remain) {
        total_point_remain += obj.amount;
      }

      console.log('total_point_remain!!!!!!!!!', total_point_remain);
      let deductResult = await this.knex('users')
        .update('points', total_point_remain)
        .where('id', +updatePointsDto.bidder_id);

      let changePostStatus = await this.knex('posts')
        .update('status', 'sold&holding')
        .where('id', +updatePointsDto.post_id);

      let changeStorageStatus = await this.knex('storages')
        .update({
          buyer_id: +updatePointsDto.bidder_id,
        })
        .where('product_id', +updatePointsDto.post_id);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }

    return {
      status: 200,
      message: 'transaction complete',
      message2: 'required_amount:',
      required_amount,
      message3: 'origin_points:',
      buyer_origin_points,
      message4: 'new_points',
      new_points,
    };
  }

  stripeConfig() {
    return { key: env.PUBLIC_STRIPE_KEY };
  }

  async addPoints(updatePointsDto: UpdatePointsDto) {
    const { points, userId, clientSecret } = updatePointsDto;
    let result = await this.knex('users').select('points').where('id', userId);
    console.log(result[0]);
    let remainPoints: string = result[0].points;
    console.log(remainPoints);

    function add(a, b) {
      return parseInt(a) + parseInt(b);
    }
    let totalPoint = add(remainPoints, points);

    console.log('totalAmount::::::', totalPoint);
    let addPoints = await this.knex('users')
      .update({
        points: totalPoint,
      })
      .where('id', userId);
    let client_secret = clientSecret.split('_').slice(0, 2).join('_');
    let addClientSecret = await this.knex('client_secrets').insert({
      amount: points,
      client_secret: client_secret,
      user_id: userId,
    });

    return {
      message: `${addPoints} is already add to user: ${userId}`,
      message2: `${clientSecret} is already add to ${addClientSecret[0]}`,
    };
  }

  async deductPoints(updatePointsDto: UpdatePointsDto) {
    const { points, userId, clientSecret } = updatePointsDto;
    let result = await this.knex('users').select('points').where('id', userId);
    console.log(result[0]);

    let remainPoints: string = result[0].points;
    function deduct(a, b) {
      return parseInt(a) - parseInt(b);
    }
    let afterDeductPoint = deduct(remainPoints, points);

    let deductPoints = await this.knex('users')
      .update({
        points: afterDeductPoint,
      })
      .where('id', userId);

    let client_secret = clientSecret.split('_').slice(0, 2).join('_');
    let deleteClientSecret = await this.knex('client_secrets')
      .delete(' client_secrets', client_secret)
      .where('user_id', userId);

    return { deleteClientSecret };
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
