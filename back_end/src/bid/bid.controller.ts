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

@Controller('bid')
export class BidController {
  static instance: BidController;

  constructor(private readonly bidService: BidService) {
    BidController.instance = this;
  }

  setupIO(io: Server) {
    console.log('setupIO');
    io.on('connection', (socket) => {
      console.log('socket connected:', socket.id);
      socket.on('join-room', (postId) => {
        console.log('join-room', { id: socket.id, postId });
      });
    });
  }

  @Post()
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidService.create(createBidDto);
  }

  @Post('biding')
  biding(@Body() createBidDto: CreateBidDto) {
    io.to('/room:' + createBidDto.postId).emit('new bid received', {
      id: createBidDto.postId,
    });
    return this.bidService.biding(createBidDto);
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
