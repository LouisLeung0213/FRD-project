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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('postItem/:id')
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'photo', maxCount: 10 },
  //     { name: 'image', maxCount: 10 },
  //   ]),
  // )
  // uploadFile(
  //   @UploadedFile()
  //   file: {
  //     photo?: Express.Multer.File[];
  //     image?: Express.Multer.File[];
  //   },
  // );
  create(@Param('id') id: number, @Body() createPostDto: CreatePostDto) {
    console.log('Body:', createPostDto);
    this.postsService.create(createPostDto);
    return { message: 'here' };
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
