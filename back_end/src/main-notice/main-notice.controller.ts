import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MainNoticeService } from './main-notice.service';
import { CreateMainNoticeDto } from './dto/create-main-notice.dto';
import { UpdateMainNoticeDto } from './dto/update-main-notice.dto';

@Controller('main-notice')
export class MainNoticeController {
  constructor(private readonly mainNoticeService: MainNoticeService) {}

  @Post()
  create(@Body() createMainNoticeDto: CreateMainNoticeDto) {
    return this.mainNoticeService.create(createMainNoticeDto);
  }

  @Get()
  findAll() {
    return this.mainNoticeService.findAll();
  }

  @Get('/getMine/:id')
  findOne(@Param('id') id: string) {
    return this.mainNoticeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMainNoticeDto: UpdateMainNoticeDto,
  ) {
    return this.mainNoticeService.update(+id, updateMainNoticeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mainNoticeService.remove(+id);
  }
}
