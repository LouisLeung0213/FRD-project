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
    let post_id = await this.postsService.create(createPostDto);
    console.log('Body:', createPostDto, files);
    for (let file of files.photo || []) {
      let filename = '123-' + file.fieldname + '-' + file.originalname;

      await writeFile(join('uploads', filename), file.buffer);

      await this.postsService.createImageLink(filename, post_id[0].id);
    }

    return { status: 200, message: 'create post successfully' };
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
