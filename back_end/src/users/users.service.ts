import { Injectable } from '@nestjs/common';
import { HTTPError } from 'error';
import { hashPassword } from 'hash';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  //inject knex from nestjs-Knex
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async create(createUserDto: CreateUserDto) {
    let password_hash = await hashPassword(createUserDto.password_hash);
    let checkUser = await this.knex
      .select('username')
      .from('users')
      .where('username', createUserDto.username);
    if (checkUser[0]) {
      throw new HTTPError(401, 'username is taken');
    }

    let result = await this.knex('users')
      .insert({
        username: createUserDto.username,
        password_hash: password_hash,
        email: createUserDto.email,
        nickname: createUserDto.nickname,
        phone: createUserDto.phone,
        is_admin: createUserDto.is_admin,
      })
      .returning('id');

    let row = result[0].id;
    console.log(row);
    if (!row) {
      throw new HTTPError(401, 'Invalid input');
    }

    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(username: string) {
    return {
      id: 1,
      username: username,
      password: await bcrypt.hash('123456', 10),
    };;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
