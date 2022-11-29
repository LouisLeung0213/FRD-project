import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { InsertChatroomDto } from './dto/insert-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

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
  send(@Param('id') id: string, @Body() insertChatroomDto: InsertChatroomDto) {
    return this.chatroomService.send(+id, insertChatroomDto);
  }

  @Get('roomDetail/:postId')
  findAll(@Param('postId') postId: string) {
    return this.chatroomService.findAll(+postId);
  }

  @Get('room/:id')
  findOne(@Param('id') id: string) {
    return this.chatroomService.findOne(+id);
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
