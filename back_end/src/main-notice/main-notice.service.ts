import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateMainNoticeDto } from './dto/create-main-notice.dto';
import { UpdateMainNoticeDto } from './dto/update-main-notice.dto';

@Injectable()
export class MainNoticeService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  create(createMainNoticeDto: CreateMainNoticeDto) {
    return 'This action adds a new mainNotice';
  }

  findAll() {
    return `This action returns all mainNotice`;
  }

  async findOne(id: number) {
    let result = await this.knex
      .select('content', 'receive_time', 'post_id')
      .from('notifications')
      .where('receiver_id', id);
    return result;
  }

  update(id: number, updateMainNoticeDto: UpdateMainNoticeDto) {
    return `This action updates a #${id} mainNotice`;
  }

  remove(id: number) {
    return `This action removes a #${id} mainNotice`;
  }
}
