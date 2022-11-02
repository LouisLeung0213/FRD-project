import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { Knex } from 'knex';
import { HTTPError } from 'error';
import{}

@Injectable()
export class UsersService {
  constructor(private knex: Knex) {}
  //   users: User[] = [];

  async signUp(
    username: string,
    password_hash: string,
    nickname: string,
    phone: string,
    email: string,
    point: number,
    is_admin: boolean,
  ): Promise<any> {
    let checkUser = await this.knex
      .select('username')
      .from('users')
      .where('username', username);
    if (checkUser[0]) {
      throw new HTTPError(401, 'username is taken');
    }
    let result = await this.knex("users")
      .insert({
        username,
        password_hash: hashedPassWord,
        phone,
        email,
        nickname,
        point,
        is_admin,
      })
      .returning("id");
  }
}
