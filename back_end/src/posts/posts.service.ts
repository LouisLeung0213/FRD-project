import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async create(createPostDto: CreatePostDto) {
    try {
      let quality_plan = false;
      let pending_in = 'selling';
      let post_time: any = this.knex.fn.now();
      let locationId: number = 1;
      if (createPostDto.qualityPlan === 't') {
        quality_plan = true;
        pending_in = 'pending_in';
        let location = await this.knex('store_location')
          .select('*')
          .where('location', createPostDto.location)
          .returning('id');
        locationId = location[0].id;
      }
      let promotion_plan = false;
      if (createPostDto.promotion === 't') {
        promotion_plan = true;
      }
      console.log({
        user_id: +createPostDto.user_id,
        post_title: createPostDto.title,
        post_description: createPostDto.description,
        original_price: createPostDto.startPrice,
        q_mark: quality_plan,
        auto_adjust_plan: promotion_plan,
        location_id: locationId,
        status: pending_in,
        post_time: post_time,
      });
      let createPost = await this.knex('posts')
        .insert({
          user_id: +createPostDto.user_id,
          post_title: createPostDto.title,
          post_description: createPostDto.description,
          original_price: createPostDto.startPrice,
          q_mark: quality_plan,
          auto_adjust_plan: promotion_plan,
          location_id: locationId,
          status: pending_in,
          post_time: post_time,
        })
        .returning('id');

      console.log(createPost);
      let tags = createPostDto.tags.split('#');
      console.log(tags);
      tags.shift();

      console.log(tags);
      for (let tag of tags) {
        let createTags = await this.knex('tags').insert({
          tag_name: tag,
          post_id: createPost[0].id,
        });
      }

      return createPost;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async createImageLink(filename: string, post_id: number) {
    await this.knex('images').insert({
      src: filename,
      post_id: post_id,
    });
  }

  async findAll() {
    let findAllTruePosts = await this.knex
      .select(
        'posts.id',
        'user_id',
        'post_title',
        'post_description',
        'original_price',
        'status',
        'location_id',
        'username',
      )
      .from('posts')
      .join('users', 'user_id', 'users.id')
      .where('status', 'pending_in');
    return findAllTruePosts;
  }

  async findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    let updatePostInfo = await this.knex('posts')
      .update({
        post_title: updatePostDto.postTitle,
        post_description: updatePostDto.postDescription,
        status: 'selling',
      })
      .where('id', updatePostDto.postId);
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
