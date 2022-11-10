import { HttpException, Injectable } from '@nestjs/common';
import { HTTPError } from 'error';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
      throw new HttpException('This username is already used',401);
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
        throw new HttpException('Register unsuccessfully',500)
      }
  
      return 'This action adds a new user';
    }

  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(username: string) {
    try {
      let result = await this.knex
      .select("id", "username", "password_hash")
      .from("users")
      .where("username", username)
      
      if (result.length > 0){
        let user = result[0]
        return {
          id: user.id,
          username: user.username,
          password: user.password_hash
        }
      } else {
        throw new HTTPError(401, 'Wrong username');
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
