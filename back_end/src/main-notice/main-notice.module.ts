import { Module } from '@nestjs/common';
import { MainNoticeService } from './main-notice.service';
import { MainNoticeController } from './main-notice.controller';

@Module({
  controllers: [MainNoticeController],
  providers: [MainNoticeService]
})
export class MainNoticeModule {}
