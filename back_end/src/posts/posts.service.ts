import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async create(createPostDto: CreatePostDto) {
    let quality_plan = false;
    let pending_in = false;
    if (createPostDto.qualityPlan === 't') {
      quality_plan = true;
      pending_in = true;
    }
    let promotion_plan = false;
    if (createPostDto.promotion === 't') {
      promotion_plan = true;
    }

    let locationId = await this.knex('store_location')
      .select('*')
      .where({ location: createPostDto.location });

    let createPost = await this.knex('posts')
      .insert({
        user_id: createPostDto.user_id,
        post_title: createPostDto.title,
        post_description: createPostDto.description,
        original_price: createPostDto.startPrice,
        q_mark: quality_plan,
        auto_adjust_plan: promotion_plan,
        location_id: locationId[0].id,
        is_pending_in: pending_in,
      })
      .returning('id');

    return createPost;
  }

  async createImageLink(filename: string, post_id: number) {
    await this.knex('images').insert({
      src: filename,
      post_id: post_id,
    });
  }

  async findAll() {
    let findAllTruePosts = await this.knex
      .select('*')
      .from('posts')
      .where('is_pending_in', true);
    return findAllTruePosts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    let updatePostInfo = await this.knex('posts')
      .update({
        post_title: updatePostDto.postTitle,
        post_description: updatePostDto.postDescription,
        is_pending_out: true,
      })
      .where('id', updatePostDto.postId);
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
