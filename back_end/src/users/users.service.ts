import { HttpException, Injectable } from '@nestjs/common';
import { HTTPError } from 'error';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/update-user.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import * as bcrypt from 'bcrypt';
import passport from 'passport';

@Injectable()
export class UsersService {
  //inject knex from nestjs-Knex
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createUserDto: CreateUserDto) {
    let checkUser = await this.knex
      .select('username')
      .from('users')
      .where('username', createUserDto.username);
    if (checkUser.length > 0) {
      throw new HttpException('This username is already used', 401);
    } else {
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

      return { msg: 'This action adds a new user' };
    }
  }

  findAll() {
    return `This action returns all users`;
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
        )
        .from('users')
        .where('username', username);

      if (result.length > 0) {
        let user = result[0];
        // console.log("user: ", user)
        return {
          id: user.id,
          username: user.username,
          password: user.password_hash,
          nickname: user.nickname,
          phone: user.phone,
          email: user.email,
          joinedTime: user.joinedTime,
        };
      } else {
        throw new HttpException('Wrong username or password', 401);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUserInfo(id: number, updateUserInfoDto: UpdateUserInfoDto) {
    try {
      
      let users = await this.knex
        .select('id')
        .from('users')
        .where('id', id);

      if (users.length > 0) {
        let userId = await this.knex('users')
          .where('id', id)
          .update(
            {nickname: updateUserInfoDto.nickname,
            phone: updateUserInfoDto.phone,
            email: updateUserInfoDto.email},
          )
          .returning('id');

        return {
          userId,
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
        .select('id','password_hash')
        .from('users')
        .where('id', id);

      if (users.length > 0) {
        if (await bcrypt.compare(updatePasswordDto.oldPassword, users[0].password_hash)){
          let userId = await this.knex('users')
            .where('id', id)
            .update(
              {password_hash: await bcrypt.hash(updatePasswordDto.newPassword, 10)},
            )
            .returning('id');
  
          return {
            userId,
          };

        } else {
          throw new HttpException('Wrong old password', 401)
        }
      } else {
        throw new HttpException('No such user', 401);
      }

    
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
