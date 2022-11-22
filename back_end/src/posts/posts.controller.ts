import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { UpdateStatusDto } from './dto/updateStatus-post.dto';

mkdirSync('uploads', { recursive: true });

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('postItem')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 10 },
      { name: 'image', maxCount: 10 },
    ]),
  )
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  ) {
    let counter = 0;
    let timestamp = Date.now();
    let post_id = await this.postsService.create(createPostDto);
    console.log('Body:', createPostDto, files);
    for (let file of files.photo || []) {
      counter++;
      let filename =
        '123-' + file.fieldname + '-' + file.originalname + timestamp + counter;

      await writeFile(join('uploads', filename), file.buffer);

      await this.postsService.createImageLink(filename, post_id[0].id);
    }

    return { status: 200, message: 'create post successfully' };
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('showAll')
  showAll() {
    return this.postsService.showAll();
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Get('showVerify')
  showVerify() {
    return this.postsService.showVerify();
  }

  @Patch('ready/:id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Patch('updateStatus/:id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.postsService.updateStatus(+id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
