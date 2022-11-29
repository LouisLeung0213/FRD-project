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

  async savedBank(id: number) {
    let banks_id = await this.knex
      .select('*')
      .from('bank_account')
      .where('user_id', id);
    let bank_name_arr = [];
    console.log('banks_id', banks_id);
    if (banks_id.length > 0) {
      for (let i = 0; i < banks_id.length; i++) {
        let bank_name = await this.knex
          .select('bank_name')
          .from('bank')
          .where('id', banks_id[i].bank_id);
        console.log(bank_name[0].bank_name);

        bank_name_arr.push(bank_name[0]);
      }
    }

    return { bank_name_arr, banks_id };
  }

  update(id: number, updateInformationDto: UpdateInformationDto) {
    return `This action updates a #${id} information`;
  }

  async deleteBank(accountShouldDelete: number) {
    let result = await this.knex
      .delete()
      .from('bank_account')
      .where('bank_account', accountShouldDelete);

    return { message: 'account delete successfully' };
  }
}
