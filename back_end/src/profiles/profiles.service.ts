import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class ProfilesService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async getUserInfo(userId: number) {
    let userInfo = await this.knex
      .select('*')
      .from('users')
      .where('id', userId);

    let bankInfo = await this.knex
      .select('*')
      .from('bank_accounts')
      .where('user_id', userId);

    return { userInfo: userInfo[0], bankInfo: bankInfo };
  }
}
