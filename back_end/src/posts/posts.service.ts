import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateStatusDto } from './dto/updateStatus-post.dto';

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
        this.knex.raw('json_agg(src)'),
      )
      .from('posts')
      .join('users', 'user_id', 'users.id')
      .join('images', 'post_id', 'posts.id')
      .where('status', 'pending_in')
      .groupBy('posts.id', 'users.username');
    return findAllTruePosts;
  }

  async showAll() {
    let showAllList = await this.knex
      .select(
        'posts.id',
        'user_id',
        'post_title',
        'post_description',
        'original_price',
        'q_mark',
        'admin_title',
        'admin_comment',
        'post_time',
        'nickname',
        'username',
        this.knex.raw('json_agg(src)'),
      )
      .from('posts')
      .join('users', 'user_id', 'users.id')
      .join('images', 'posts.id', 'post_id')
      .where('status', 'selling')
      .groupBy('posts.id', 'users.username', 'users.nickname');
    return showAllList;
  }

  async findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async showVerify() {
    let needVerify = await this.knex
      .select(
        'post_title',
        'post_description',
        'user_id',
        'receipt_code',
        'posts.id',
        this.knex.raw('json_agg(src)'),
      )
      .from('posts')
      .join('storages', 'posts.id', 'product_id')
      .join('images', 'posts.id', 'post_id')
      .where('status', 'verifying')
      .groupBy('posts.id', 'storages.receipt_code');

    return needVerify;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    let updatePostInfo = await this.knex('posts')
      .update({
        admin_title: updatePostDto.postTitle,
        admin_comment: updatePostDto.postDescription,
        status: 'selling',
      })
      .where('id', updatePostDto.postId);
    console.log(updatePostInfo);
    return `This action updates a #${id} post`;
  }

  async updateStatus(id: number, updateStatusDto: UpdateStatusDto) {
    console.log(updateStatusDto);

    await this.knex('posts')
      .update({
        status: updateStatusDto.status,
        q_mark: false,
        admin_comment: updateStatusDto.adminComment,
      })
      .where('id', id);
    return `product ${id} status has been change to ${updateStatusDto.status}`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
