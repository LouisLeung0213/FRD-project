import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class StoragesService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async create(createStorageDto: CreateStorageDto) {
    let acceptReq = await this.knex('storages')
      .insert({
        receipt_code: createStorageDto.receiptCode,
        seller_id: createStorageDto.sellerId,
        product_id: createStorageDto.productId,
      })
      .returning(['receipt_code', 'product_id']);

    if (acceptReq[0]) {
      await this.knex('posts')
        .update({ is_pending_in: false })
        .where('id', acceptReq[0].product_id);
    } else {
      return `Insert failed`;
    }
    return acceptReq[0];
  }

  async findAll() {
    let productDetails = await this.knex
      .select(
        'product_id',
        'seller_id',
        'receipt_code',
        'in_time',
        'nickname',
        'phone',
        'email',
        'post_title',
        'post_description',
      )
      .from('storages')
      .join('users', 'seller_id', 'users.id')
      .join('posts', 'product_id', 'posts.id');
    return productDetails;
  }

  findOne(id: number) {
    return `This action returns a #${id} storage`;
  }

  update(id: number, updateStorageDto: UpdateStorageDto) {
    return `This action updates a #${id} storage`;
  }

  remove(id: number) {
    return `This action removes a #${id} storage`;
  }
}
