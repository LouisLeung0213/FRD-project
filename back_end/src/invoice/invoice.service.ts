import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  create(createInvoiceDto: CreateInvoiceDto) {
    return 'This action adds a new invoice';
  }

  dealInvoice(id: number) {
    return `This action returns all deal invoice`;
  }

  async findThisUserInvoice(id: number) {
    let storagesInvoiceList = await this.knex
      .select('receipt_code', 'in_time', 'post_title', 'product_id')
      .from('storages')
      .join('posts', 'product_id', 'posts.id')
      .where('seller_id', id);

    return storagesInvoiceList;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoice`;
  }
}
