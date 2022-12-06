import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { io } from 'src/io';
import { Server } from 'socket.io';
import { PostsService } from 'src/posts/posts.service';

@Controller('bid')
export class BidController {
  static instance: BidController;

  constructor(
    private readonly bidService: BidService,
    private readonly postsService: PostsService,
  ) {
    BidController.instance = this;
  }

  setupIO(io: Server) {
    console.log('setupIO');
    io.on('connection', (socket) => {
      console.log('socket connected:', socket.id);
      socket.on('join-room', (postId) => {
        console.log('join-room', { id: socket.id, postId });
        socket.join('room: ' + postId);
      });
      socket.on('join-TJroom', (data) => {
        socket.join('TJroom: ' + data.userId);
        console.log('TJroom', data.userId);
      });
      socket.on('join-chat-room', (data) => {
        socket.join('makeDealRoom: ' + data);
      });
      socket.on('leave-room', (data) => {
        socket.leave('room: ' + data);
      });
      socket.on('leave-chat-room', (data) => {
        socket.leave('makeDealRoom: ' + data);
      });
      socket.on('leave-TJroom', (data) => {
        socket.leave('TJroom: ' + data);
      });
    });
  }

  @Post()
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidService.create(createBidDto);
  }

  @Post('bidding')
  async bidding(@Body() createBidDto: CreateBidDto) {
    let newBidList = await this.bidService.bidding(createBidDto);
    let newPriceList = await this.postsService.showAll();
    if (!('status' in newBidList)) {
      console.log('newBidList', newBidList.firstBidNoti);
      io.to('room: ' + createBidDto.postId).emit('newBidReceived', {
        newBidContent: newBidList.bid,
      });
      io.emit('priceUpdated', {
        newPrice: newPriceList,
      });
      if (newBidList.firstBidNoti) {
        io.to('TJroom: ' + newBidList.firstBidNoti.receiver_id).emit(
          'bid-received',
          {
            msg: newBidList.firstBidNoti.content,
          },
        );
      }
      if (newBidList.infoSeller) {
        io.to('TJroom: ' + newBidList.infoSeller.receiver_id).emit(
          'info-seller',
          {
            msg: newBidList.infoSeller.content,
          },
        );
      }
    }
    console.log('newBidList', newBidList);
    return newBidList;
  }

  @Post('updateBidding')
  async updateBidding(@Body() updateBidDto: UpdateBidDto) {
    let result = await this.bidService.updateBidding(updateBidDto);
    let newPriceList = await this.postsService.showAll();
    let newBidContent = [
      {
        post_id: '',
        buyer_id: '',
        bid_price: '',
        nickname: '',
      },
    ];
    io.to('room: ' + updateBidDto.postId).emit('newBidReceived', {
      newBidContent,
    });
    io.emit('priceUpdated', {
      newPrice: newPriceList,
    });
    for (let bidder of result.bidderList) {
      io.to('TJroom: ' + bidder.buyer_id).emit('bid-received', {
        msg: result.content,
      });
    }

    return { msg: result.content };
  }

  @Get('bidList/:id')
  findAll(@Param('id') id: string) {
    return this.bidService.findAll(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidService.update(+id, updateBidDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bidService.remove(+id);
  }
}
