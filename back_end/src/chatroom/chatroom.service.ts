import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { InsertChatroomDto } from './dto/insert-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@Injectable()
export class ChatroomService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  create(createChatroomDto: CreateChatroomDto) {
    return 'This action adds a new chatroom';
  }

  async openChat(
    id: number,
    joinerId: number,
    createChatroomDto: CreateChatroomDto,
  ) {
    let checkIfRoomExist = await this.knex
      .select('*')
      .from('chatrooms')
      .where('room_user_id', joinerId)
      .andWhere('post_id', id)
      .returning('id');
    console.log('check', checkIfRoomExist);
    if (checkIfRoomExist[0]) {
      console.log('here?');
      return checkIfRoomExist;
    } else {
      let openChat = await this.knex('chatrooms')
        .insert({
          post_id: id,
          room_user_id: joinerId,
        })
        .returning('id');
      // if ('id' in openChat) {
      //   let addJoiner = await this.knex('chatroom_users')
      //     .insert({
      //       chatroom_id: openChat[0].id,
      //       user_id: createChatroomDto.userId,
      //     })
      //     .returning('id');
      //   let addOpener = await this.knex('chatroom_users')
      //     .insert({
      //       chatroom_id: openChat[0].id,
      //       user_id: id,
      //     })
      //     .returning('id');
      // return addJoiner[0], addOpener[0];
      // } else {
      return openChat;
    }
  }

  async send(chatroomId: number, insertChatroomDto: InsertChatroomDto) {
    let send = await this.knex('chat_histories')
      .insert({
        chatroom_id: chatroomId,
        content: insertChatroomDto.msg,
        sender_id: insertChatroomDto.senderId,
      })
      .returning('id');
    return send[0];
  }

  async getOwnerId(chatroomId: number) {
    let ownerId = await this.knex
      .select('users.id')
      .from('chatrooms')
      .join('posts', 'post_id', 'posts.id')
      .join('users', 'users.id', 'user_id')
      .where('post_id', chatroomId);
    console.log('ownerId', ownerId[0]);
    return ownerId[0];
  }

  async findAll(postId: number) {
    let postDetail = await this.knex
      .select(
        'chatrooms.post_id',
        'post_title',
        'original_price',
        this.knex.raw('json_agg(src)'),
        this.knex.raw('max(bid_price)'),
      )
      .from('chatrooms')
      .join('posts', 'chatrooms.post_id', 'posts.id')
      .join('images', 'images.post_id', 'posts.id')
      .fullOuterJoin('bid_records', 'bid_records.post_id', 'posts.id')
      .where('chatrooms.id', postId)
      .groupBy('posts.post_title', 'posts.original_price', 'chatrooms.post_id');
    return postDetail[0];
  }

  async msg(chatroomId: number) {
    let msgList = await this.knex
      .select('content', 'sender_id', 'send_time', 'icon_src')
      .from('chat_histories')
      .join('users', 'sender_id', 'users.id')
      .where('chatroom_id', chatroomId);
    return msgList;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatroom`;
  }

  update(id: number, updateChatroomDto: UpdateChatroomDto) {
    return `This action updates a #${id} chatroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatroom`;
  }
}
