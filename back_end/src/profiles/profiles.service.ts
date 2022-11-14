import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class ProfilesService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async getUserInfo(username: string) {
    let userInfo = await this.knex
      .select('username', 'nickname', 'phone', 'email', 'joinedTime')
      .from('users')
      .where('username', username);
    return userInfo[0];
  }
}
