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
    let pending_in = 'selling';
    let post_time: any = this.knex.fn.now();
    let locationId: number = 1;
    if (createPostDto.qualityPlan === 't') {
      quality_plan = true;
      pending_in = 'pending_in';
      locationId = await this.knex('store_location')
        .select('*')
        .where('location', createPostDto.location)
        .returning('id');
    }
    let promotion_plan = false;
    if (createPostDto.promotion === 't') {
      promotion_plan = true;
    }

    let createPost = await this.knex('posts')
      .insert({
        user_id: createPostDto.user_id,
        post_title: createPostDto.title,
        post_description: createPostDto.description,
        original_price: createPostDto.startPrice,
        q_mark: quality_plan,
        auto_adjust_plan: promotion_plan,
        location_id: locationId[0].id,
        status: pending_in,
        post_time: post_time,
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

  async showVerify() {
    let needVerify = await this.knex
      .select(
        'post_title',
        'post_description',
        'user_id',
        'receipt_code',
        'posts.id',
      )
      .from('posts')
      .join('storages', 'posts.id', 'product_id')
      .where('status', 'verifying');

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

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
