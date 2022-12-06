import { HttpException, Injectable } from '@nestjs/common';
import { HTTPError } from 'error';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/update-user.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import * as bcrypt from 'bcrypt';
import passport from 'passport';
import { UpdateDotsDto } from './dto/update-dots-dto';

@Injectable()
export class UsersService {
  //inject knex from nestjs-Knex
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createUserDto: CreateUserDto) {
    try {
      await this.knex('users')
        .insert({
          username: createUserDto.username,
          password_hash: await bcrypt.hash(createUserDto.password, 10),
          email: createUserDto.email,
          nickname: createUserDto.nickname,
          phone: createUserDto.phone,
          // is_admin: createUserDto.is_admin,
        })
        .returning('id');
    } catch (error) {
      throw new HttpException('Register unsuccessfully', 500);
    }
  }

  async checkSignUp(createUserDto: CreateUserDto) {
    let checkUser = await this.knex
      .select('username')
      .from('users')
      .where('username', createUserDto.username);
    console.log('checkUser', checkUser[0]);
    let checkPhone = await this.knex
      .select('phone')
      .from('users')
      .where('phone', createUserDto.phone);
    console.log('checkPhone', checkPhone[0]);

    if (checkUser[0]) {
      throw new HttpException('This username is already used', 401);
    } else if (checkPhone[0]) {
      throw new HttpException('This phone number is already used', 402);
    } else {
      return { msg: 'you can register now' };
    }
  }

  async findOne(username: string) {
    try {
      let result = await this.knex
        .select(
          'id',
          'username',
          'password_hash',
          'nickname',
          'phone',
          'email',
          'joinedTime',
          'is_admin',
          'icon_name',
          'icon_src',
          'chat_dots',
          'notice_dots',
        )
        .from('users')
        .where('username', username);
      if (result.length > 0) {
        let user = result[0];
        console.log('user: ', user);

        return {
          id: user.id,
          username: user.username,
          password: user.password_hash,
          nickname: user.nickname,
          phone: user.phone,
          email: user.email,
          joinedTime: user.joinedTime,
          is_admin: user.is_admin,
          icon_name: user.icon_name,
          icon_src: user.icon_src,
          chat_dots: user.chat_dots,
          notice_dots: user.notice_dots,
        };
      } else {
        throw new HttpException('Wrong username or password', 401);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async checkIsBanned(id: number) {
    let result = await this.knex
      .select('user_id')
      .from('banned_users')
      .where('user_id', id);
    return result[0];
  }

  async findOneById(id: number) {
    try {
      let result = await this.knex
        .select('username')
        .from('users')
        .where('id', id);

      if (result.length > 0) {
        let username = result[0].username;
        let userInfo = this.findOne(username);
        return userInfo;
      } else {
        throw new HttpException('No this user', 401);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserInfo(id: number, updateUserInfoDto: UpdateUserInfoDto) {
    try {
      let users = await this.knex.select('id').from('users').where('id', id);

      let bank_id = await this.knex
        .select('id')
        .from('banks')
        .where('bank_name', updateUserInfoDto.bank_name);

      if (users.length > 0) {
        let userId = await this.knex('users')
          .where('id', id)
          .update({
            nickname: updateUserInfoDto.nickname,
            phone: updateUserInfoDto.phone,
            email: updateUserInfoDto.email,
            icon_name: updateUserInfoDto.icon_name,
            icon_src: updateUserInfoDto.icon_src,
          })
          .returning('id');

        let addBank;
        if (updateUserInfoDto.bank_account) {
          addBank = await this.knex('bank_accounts').insert({
            bank_account: updateUserInfoDto.bank_account,
            user_id: id,
            bank_id: bank_id[0].id,
          });
        }

        return {
          userId,
          addBank,
        };
      } else {
        throw new HttpException('No such user', 401);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    let users = await this.knex
      .select('id', 'password_hash')
      .from('users')
      .where('id', id);

    if (users.length > 0) {
      if (
        await bcrypt.compare(
          updatePasswordDto.oldPassword,
          users[0].password_hash,
        )
      ) {
        let userId = await this.knex('users')
          .where('id', id)
          .update({
            password_hash: await bcrypt.hash(updatePasswordDto.newPassword, 10),
          })
          .returning('id');

        return {
          userId,
        };
      } else {
        throw new HttpException('Wrong old password', 401);
      }
    } else {
      throw new HttpException('No such user', 401);
    }
  }

  async dotsUpdate(id: number, updateDotsDto: UpdateDotsDto) {
    console.log('updateding', updateDotsDto);
    let result = await this.knex('users')
      .where('id', id)
      .update({
        [updateDotsDto.statusLocation]: updateDotsDto.status,
      })
      .returning(`${updateDotsDto.statusLocation}`);
    return result[0];
  }

  async getDots(id: number) {
    let result = await this.knex
      .select('chat_dots', 'notice_dots')
      .from('users')
      .where('id', id);
    return result[0];
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findAll() {
    try {
      let result = await this.knex.select('username').from('users');
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}
