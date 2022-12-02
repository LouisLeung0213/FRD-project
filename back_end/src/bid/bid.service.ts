import { Injectable } from '@nestjs/common';
import { Console } from 'console';
import { LargeNumberLike } from 'crypto';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

@Injectable()
export class BidService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  create(createBidDto: CreateBidDto) {
    return 'This action adds a new bid';
  }

  async biding(createBidDto: CreateBidDto) {
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
      if (originalPrice[0].original_price >= +createBidDto.bidPrice) {
        return {
          status: '09',
          message: 'invalid bid due to bidPrice lower than originalPrice',
        };
      } else {
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
            })
            .returning(['receiver_id', 'content']);

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
        let bid = await this.knex('bid_records')
          .insert({
            post_id: createBidDto.postId,
            buyer_id: createBidDto.buyerId,
            bid_price: createBidDto.bidPrice,
          })
          .returning('id');
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
            })
            .returning(['receiver_id', 'content']);

          let infoSeller = await this.knex('notifications')
            .insert({
              receiver_id: createBidDto.sellerId,
              content: `您的貨品[${createBidDto.postTitle}]，最新價錢為$${newBidList[0].bid_price}!`,
            })
            .returning(['receiver_id', 'content']);

          console.log('infoSecondBuyer', infoSecondBuyer[1]);
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
