import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Console } from 'console';
import { LargeNumberLike } from 'crypto';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UpdatePointsDto } from 'src/payment/dto/update-points.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Injectable()
export class BidService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  create(createBidDto: CreateBidDto) {
    return 'This action adds a new bid';
  }

  async bidding(createBidDto: CreateBidDto) {
    let checkBid = await this.knex
      .select('bid_price', 'buyer_id')
      .from('bid_records')
      .where('post_id', createBidDto.postId)
      .orderBy('bid_price', 'desc');
    if (!checkBid[0]) {
      let originalPrice = await this.knex
        .select('original_price')
        .from('posts')
        .where('id', createBidDto.postId);
      if (originalPrice[0].original_price > +createBidDto.bidPrice) {
        return {
          status: '09',
          message: 'invalid bid due to bidPrice lower than originalPrice',
        };
      } else {
        // let client_secret_amount_list = await this.knex('client_secrets')
        //   .select('*')
        //   .where('user_id', createBidDto.buyerId)
        //   .andWhere('captured', false)
        //   .andWhere('used_for_bidding', false);

        // let total_unused_points = 0;

        // for (let account of client_secret_amount_list) {
        //   console.log('account.amount::!!', account.amount);
        //   total_unused_points += account.amount;
        // }

        // let used_secret_id_list = [];

        // for (let i = 0; i < client_secret_amount_list.length; i++) {
        //   let amount_for_deduct = createBidDto.bidPrice;
        //   console.log(
        //     'amount_for_deduct:::::',
        //     amount_for_deduct,
        //     'client_secret_amount_list[i].amount',
        //     client_secret_amount_list[i],
        //   );
        //   amount_for_deduct -= client_secret_amount_list[i].amount;
        //   used_secret_id_list.push(client_secret_amount_list[i].id);

        //   if (amount_for_deduct <= 0) {
        //     break;
        //   }
        // }
        // console.log('used_secret_list', used_secret_id_list);

        // let hold_secret = await this.knex('client_secrets')
        //   .update('used_for_bidding', true)
        //   .whereIn('id', used_secret_id_list);

        // let after_holding_points = 0;
        // let points_should_remain = client_secret_amount_list.filter(
        //   (objA) =>
        //     used_secret_id_list.filter((objB) => objA.id === objB).length === 0,
        // );

        // console.log(
        //   'points_should_remain:!!:!!::!!::!------------------',
        //   points_should_remain,
        // );
        // for (let obj of points_should_remain) {
        //   after_holding_points += obj.amount;
        // }
        // let points_after_bidding = await this.knex('users')
        //   .update('points', after_holding_points)
        //   .where('id', createBidDto.buyerId);

        //TODO for demo purpose without using stripe

        let pointRemain = await this.knex('users')
          .select('points')
          .where('id', +createBidDto.buyerId);
        console.log('checkPoint', pointRemain);
        let remainPoints = pointRemain[0].points - +createBidDto.bidPrice;
        console.log('how many left', remainPoints);
        let deduction = await this.knex('users')
          .update('points', remainPoints)
          .where('id', +createBidDto.buyerId)
          .returning('points');
        console.log('reduced ', deduction);
        let bid = await this.knex('bid_records')
          .insert({
            post_id: createBidDto.postId,
            buyer_id: createBidDto.buyerId,
            bid_price: createBidDto.bidPrice,
          })
          .returning('id');
        if ('id' in bid[0]) {
          let firstBidNoti = await this.knex('notifications')
            .insert({
              receiver_id: createBidDto.sellerId,
              content: `買家[${createBidDto.buyerNickname}]在[${createBidDto.postTitle}]出價:$${createBidDto.bidPrice}!`,
              post_id: createBidDto.postId,
            })
            .returning(['receiver_id', 'content', 'post_id']);

          let newBidList = await this.knex
            .select('post_id', 'buyer_id', 'bid_price', 'nickname')
            .from('bid_records')
            .join('users', 'buyer_id', 'users.id')
            .where('post_id', createBidDto.postId)
            .limit(5)
            .orderBy('bid_price', 'desc');
          return { bid: newBidList, firstBidNoti: firstBidNoti[0] };
        }

        return { message: 'insert failed' };
      }
    } else {
      if (+checkBid[0].bid_price >= +createBidDto.bidPrice) {
        return {
          status: '19',
          message: 'invalid bid due to bidPrice lower than existing bidPrice',
        };
      } else {
        let pointRemain = await this.knex('users')
          .select('points')
          .where('id', +createBidDto.buyerId);
        console.log('checkPoint', pointRemain);
        let remainPoints = pointRemain[0].points - +createBidDto.bidPrice;
        console.log('how many left', remainPoints);
        let deduction = await this.knex('users')
          .update('points', remainPoints)
          .where('id', +createBidDto.buyerId)
          .returning('points');
        console.log('reduced ', deduction);
        let bid = await this.knex('bid_records')
          .insert({
            post_id: createBidDto.postId,
            buyer_id: createBidDto.buyerId,
            bid_price: createBidDto.bidPrice,
          })
          .returning('id');
        let bidderUser = await this.knex
          .select('buyer_id', 'bid_price')
          .from('bid_records')
          .where('post_id', createBidDto.postId)
          .orderBy('bid_price', 'desc');

        if (bidderUser.length > 0) {
          let refunder = await this.knex
            .select('points')
            .from('users')
            .where('id', bidderUser[1].buyer_id);
          if (refunder.length > 0) {
            await this.knex('users')
              .update({ points: refunder[0].points + bidderUser[1].bid_price })
              .where('id', bidderUser[1].buyer_id);
          }
        }

        if (bid[0].id) {
          let newBidList = await this.knex
            .select('post_id', 'buyer_id', 'bid_price', 'nickname')
            .from('bid_records')
            .join('users', 'buyer_id', 'users.id')
            .where('post_id', createBidDto.postId)
            .limit(5)
            .orderBy('bid_price', 'desc');

          let infoSecondBuyer = await this.knex('notifications')
            .insert({
              receiver_id: checkBid[0].buyer_id,
              content: `您在[${createBidDto.postTitle}]的出價被超越了！`,
              post_id: createBidDto.postId,
            })
            .returning(['receiver_id', 'content', 'post_id']);

          let infoSeller = await this.knex('notifications')
            .insert({
              receiver_id: createBidDto.sellerId,
              content: `您的貨品[${createBidDto.postTitle}]，最新價錢為$${newBidList[0].bid_price}!`,
              post_id: createBidDto.postId,
            })
            .returning(['receiver_id', 'content', 'post_id']);

          // let client_secret_amount_list = await this.knex('client_secrets')
          //   .select('*')
          //   .where('user_id', createBidDto.buyerId)
          //   .andWhere('captured', false)
          //   .andWhere('used_for_bidding', false);

          // let total_unused_points = 0;

          // for (let account of client_secret_amount_list) {
          //   console.log('account.amount::!!', account.amount);
          //   total_unused_points += account.amount;
          // }

          // let used_secret_id_list = [];

          // for (let i = 0; i < client_secret_amount_list.length; i++) {
          //   let amount_for_deduct = createBidDto.bidPrice;
          //   console.log(
          //     'amount_for_deduct:::::',
          //     amount_for_deduct,
          //     'client_secret_amount_list[i].amount',
          //     client_secret_amount_list[i].amount,
          //   );
          //   amount_for_deduct -= client_secret_amount_list[i].amount;
          //   used_secret_id_list.push(client_secret_amount_list[i].id);

          //   if (amount_for_deduct <= 0) {
          //     break;
          //   }
          // }
          // console.log('used_secret_list', used_secret_id_list);

          // let hold_secret = await this.knex('client_secrets')
          //   .update('used_for_bidding', true)
          //   .whereIn('id', used_secret_id_list);

          // let after_holding_points = 0;
          // let points_should_remain = client_secret_amount_list.filter(
          //   (objA) =>
          //     used_secret_id_list.filter((objB) => objA.id === objB.id)
          //       .length === 0,
          // );

          // for (let obj of points_should_remain) {
          //   after_holding_points += obj.amount;
          // }
          // let points_after_bidding = await this.knex('users')
          //   .update('points', after_holding_points)
          //   .where('id', createBidDto.buyerId);

          return {
            bid: newBidList,
            firstBidNoti: infoSecondBuyer[0],
            infoSeller: infoSeller[0],
          };
        } else {
          return { status: '99', message: 'unexpected error occurred' };
        }
      }
    }
  }

  async updateBidding(updateBidDto: UpdateBidDto) {
    console.log('postId: ', updateBidDto.postId);
    console.log('updatedPrice: ', updateBidDto.updatedPrice);
    let newPrice = await this.knex('posts')
      .where('id', updateBidDto.postId)
      .update({ original_price: updateBidDto.updatedPrice })
      .returning(['post_title', 'original_price']);

    if (!newPrice) {
      return { status: '77', message: 'The post id does not exist' };
    }

    let content = `貨品[${newPrice[0].post_title}]的賣家已更改貨品底價為[${newPrice[0].original_price}]，您的預售權將會全數退回`;

    let bidderList = await this.knex
      .select('buyer_id', this.knex.raw('max(bid_price)'))
      .from('bid_records')
      .where('post_id', updateBidDto.postId)
      .groupBy('buyer_id');

    await this.knex('bid_records').where('post_id', updateBidDto.postId).del();

    return { bidderList, content };
  }

  async findAll(id: number) {
    let allBid = await this.knex
      .select('post_id', 'buyer_id', 'bid_price', 'nickname')
      .from('bid_records')
      .join('users', 'buyer_id', 'users.id')
      .where('post_id', id)
      .limit(5)
      .orderBy('bid_price', 'desc');
    return allBid;
  }

  findOne(id: number) {
    return `This action returns a #${id} bid`;
  }

  update(id: number, updateBidDto: UpdateBidDto) {
    return `This action updates a #${id} bid`;
  }

  remove(id: number) {
    return `This action removes a #${id} bid`;
  }
}
