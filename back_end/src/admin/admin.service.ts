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
      let banUser = await this.knex('banned_users')
        .insert({
          user_id: updateAdminDto.userId,
        })
        .returning('user_id');

      return banUser[0];
    }
  }

  async findAll() {
    let users = await this.knex.select('id', 'nickname').from('users');
    let bannedUsers = await this.knex
      .select('user_id', 'banned_time', 'nickname')
      .from('banned_users')
      .join('users', 'user_id', 'users.id');
    return { users, bannedUsers };
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    return 'hi';
  }

  async remove(id: number, updateAdminDto: UpdateAdminDto) {
    let checkIsAdmin = await this.knex
      .select('is_admin')
      .from('users')
      .where('id', id);
    console.log(checkIsAdmin[0]);
    if (checkIsAdmin[0] == false) {
      return { message: "You don't have the authority to ban users" };
    } else {
      await this.knex('banned_users')
        .where('user_id', updateAdminDto.userId)
        .del();

      return { message: `${updateAdminDto.userId} has been unbanned` };
    }
  }
}
