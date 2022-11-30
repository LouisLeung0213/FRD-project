import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Server } from 'socket.io';
import { io } from 'src/io';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { InsertChatroomDto } from './dto/insert-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  setupIO(io: Server) {}

  @Post()
  create(@Body() createChatroomDto: CreateChatroomDto) {
    return this.chatroomService.create(createChatroomDto);
  }

  @Post('createRoom/:id/:joinerId')
  openChat(
    @Param('id') id: string,
    @Param('joinerId') joinerId: string,
    @Body() createChatroomDto: CreateChatroomDto,
  ) {
    console.log('id', id, 'joinerId', joinerId);
    return this.chatroomService.openChat(+id, +joinerId, createChatroomDto);
  }

  @Post('send/:id')
  async send(
    @Param('id') id: string,
    @Body() insertChatroomDto: InsertChatroomDto,
  ) {
    let send = await this.chatroomService.send(+id, insertChatroomDto);
    let ownerId = await this.chatroomService.getOwnerId(+id);
    console.log('ownerId', ownerId);
    let newMSGList = await this.chatroomService.msg(ownerId.chatroom_id);

    console.log('send', newMSGList);
    if ('id' in send) {
      console.log('send');
      io.to('TJroom: ' + ownerId.room_user_id).emit('new-msg', {
        newMSG: newMSGList,
      });
      io.to('TJroom: ' + ownerId.id).emit('new-msg', {
        newMSG: newMSGList,
      });
    }
    return send;
  }

  @Get('roomDetail/:postId')
  findAll(@Param('postId') postId: string) {
    return this.chatroomService.findAll(+postId);
  }

  @Get('allRoom/:userId')
  getAllRoom(@Param('userId') userId: string) {
    return this.chatroomService.getAllRoom(+userId);
  }

  @Get('msg/:chatroomId')
  getMsg(@Param('chatroomId') chatroomId: string) {
    return this.chatroomService.msg(+chatroomId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ) {
    return this.chatroomService.update(+id, updateChatroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatroomService.remove(+id);
  }
}
