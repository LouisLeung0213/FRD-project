import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateInformationDto } from './dto/create-information.dto';
import { UpdateInformationDto } from './dto/update-information.dto';

@Injectable()
export class InformationService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  create(createInformationDto: CreateInformationDto) {
    return 'This action adds a new information';
  }

  async allBank() {
    let banks = await this.knex.select('*').from('bank');
    return banks;
  }

  findOne(id: number) {
    return `This action returns a #${id} information`;
  }

  update(id: number, updateInformationDto: UpdateInformationDto) {
    return `This action updates a #${id} information`;
  }

  remove(id: number) {
    return `This action removes a #${id} information`;
  }
}
