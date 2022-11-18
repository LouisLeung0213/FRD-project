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
      })
      .returning('receipt_code');
    return acceptReq[0];
  }

  findAll() {
    return `This action returns all storages`;
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
