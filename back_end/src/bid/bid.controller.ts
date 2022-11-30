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
    });
  }

  @Post()
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidService.create(createBidDto);
  }

  @Post('biding')
  async biding(@Body() createBidDto: CreateBidDto) {
    let newBidList = await this.bidService.biding(createBidDto);
    let newPriceList = await this.postsService.showAll();
    if (!('status' in newBidList)) {
      console.log('newBidList', newBidList);
      io.to('room: ' + createBidDto.postId).emit('newBidReceived', {
        newBidContent: newBidList,
      });
      io.emit('priceUpdated', {
        newPrice: newPriceList,
      });
    }
    return newBidList;
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
