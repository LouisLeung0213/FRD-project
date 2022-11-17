import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  async bannedUser(id: number, updateAdminDto: UpdateAdminDto) {
    let checkIsAdmin = await this.knex
      .select('is_admin')
      .from('users')
      .where('id', id);
    console.log(checkIsAdmin[0]);
    if (checkIsAdmin[0] == false) {
      return { message: "You don't have the authority to ban users" };
    } else {
      await this.knex('banned_users').insert({
        user_id: updateAdminDto.userId,
      });

      return `${updateAdminDto.userId} is now banned`;
    }
  }

  async findAll() {
    let users = await this.knex.select('id', 'nickname').from('users');
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    return 'hi';
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
