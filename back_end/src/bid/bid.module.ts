import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { PostsService } from 'src/posts/posts.service';

@Module({
  controllers: [BidController],
  providers: [BidService, PostsService],
})
export class BidModule {}
