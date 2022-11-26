import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class ProfilesService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async getUserInfo(userId: number) {
    let userInfo = await this.knex
      .select(
        'username',
        'nickname',
        'phone',
        'email',
        'joinedTime',
        'id',
        'is_admin',
        'point',
      )
      .from('users')
      .where('id', userId);
    return userInfo[0];
  }
}
