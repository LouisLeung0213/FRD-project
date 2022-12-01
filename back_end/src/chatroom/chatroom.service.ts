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
    // let getRoomId = await this.knex
    //   .select('post_id')
    //   .from('chatrooms')
    //   .where('id', chatroomId);
    let ownerId = await this.knex
      .select(
        'users.id',
        'chatrooms.post_id',
        'room_user_id',
        'chatrooms.id as chatroom_id',
      )
      .from('chatrooms')
      .join('posts', 'post_id', 'posts.id')
      .join('users', 'users.id', 'user_id')
      .where('chatrooms.id', chatroomId);
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
      .select(
        'chat_histories.id',
        'content',
        'sender_id',
        'send_time',
        'icon_src',
      )
      .from('chat_histories')
      .join('users', 'sender_id', 'users.id')
      .where('chatroom_id', chatroomId);
    return msgList;
  }

  async getAllRoom(id: number) {
    let rooms = await this.knex
      .select(
        'chatrooms.id',
        this.knex.raw('json_agg(content)->>-1 as latest_content'),
        'post_title',
        this.knex.raw('json_agg(images.src)->>0 as image'),
        'buyers.icon_src as buyer_icon',
        'sellers.icon_src as seller_icon',
        this.knex.raw('json_agg(send_time)->>-1 as latest_send_times'),
        'user_id as seller_id',
        'room_user_id as buyer_id',
        'sellers.nickname as seller_nickname',
        'buyers.nickname as buyer_nickname',
      )
      .from('chatrooms')
      .fullOuterJoin('posts', 'posts.id', 'chatrooms.post_id')
      .fullOuterJoin('users as buyers', 'buyers.id', 'chatrooms.room_user_id')
      .fullOuterJoin('users as sellers', 'sellers.id', 'posts.user_id')
      .join('chat_histories', 'chatroom_id', 'chatrooms.id')
      .fullOuterJoin('images', 'images.post_id', 'chatrooms.post_id')
      .where('chatrooms.room_user_id', id)
      .orWhere('posts.user_id', id)
      .groupBy(
        'chatrooms.id',
        'posts.post_title',
        'buyers.icon_src',
        'sellers.icon_src',
        'buyers.nickname',
        'sellers.nickname',
        'posts.user_id',
      )
      .orderBy('latest_send_times');
    return rooms;
  }

  update(id: number, updateChatroomDto: UpdateChatroomDto) {
    return `This action updates a #${id} chatroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatroom`;
  }
}
