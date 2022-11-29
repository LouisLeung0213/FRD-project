import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { UpdateStatusDto } from './dto/updateStatus-post.dto';
// import { initializeApp } from 'firebase/app';

// const firebaseConfig = {
//   apiKey: 'AIzaSyD243djxwnLoP4tSfW0CUqOlE-3z0UQGL4',
//   authDomain: 'test-6e6e8.firebaseapp.com',
//   projectId: 'test-6e6e8',
//   storageBucket: 'test-6e6e8.appspot.com',
//   messagingSenderId: '541343843596',
//   appId: '1:541343843596:web:7f5af8f2e7113d68a53529',
//   measurementId: 'G-35MBSYNCVH',
// };

@Injectable()
export class PostsService {
  // firebase storage
  // private app: any;
  constructor(@InjectKnex() private readonly knex: Knex) {
    // firebase storage
    // this.app = initializeApp(firebaseConfig);
  }
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

        // let checkBankAccount = await this.knex('users')
        //   .select('bank_account')
        //   .where('id', createPostDto.user_id)
        //   .returning('bank_account');

        // console.log(checkBankAccount);

        // if (!checkBankAccount[0].bankAccount) {
        //   await this.knex('users')
        //     .update({
        //       bank_account: createPostDto.bankAccount,
        //     })
        //     .where('id', createPostDto.user_id);
        // }
      }

      let promotion_plan = false;
      if (createPostDto.promotion === 't') {
        promotion_plan = true;
      }
      console.log('??', {
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

      console.log('createPost', createPost);
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

  async createImageLink(photo: string, post_id: number) {
    await this.knex('images').insert({
      src: photo,
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
    // let newPrice = await this.knex
    //   .select('posts.id', this.knex.raw('max(bid_price)'))

    //   .from('posts')
    //   .join('bid_records', 'post_id', 'posts.id')
    //   .groupBy('posts.id');
    // console.log('newPrice', newPrice);
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
        'status',
        'auto_adjust_plan',
        'post_time',
        'nickname',
        'username',
        this.knex.raw('json_agg(src)'),
        this.knex.raw('max(bid_price)'),
      )
      .from('posts')
      .join('users', 'user_id', 'users.id')
      .join('images', 'posts.id', 'images.post_id')
      .fullOuterJoin('bid_records', 'bid_records.post_id', 'posts.id')
      .where('status', 'selling')
      .groupBy('posts.id', 'users.username', 'users.nickname');
    // console.log('showAllList', showAllList);
    return showAllList;
  }

  async findOne(id: number) {
    // let postDetail = await this.knex
    //   .select(
    //     'user_id',
    //     'post_title',
    //     'post_description',
    //     'original_price',
    //     'q_mark',
    //     'admin_title',
    //     'admin_comment',
    //     'status',
    //     'post_time',
    //     'auto_adjust_plan',
    //     'nickname',
    //     'username',
    //     this.knex.raw('json_agg(src)'),
    //   )
    //   .from('posts')
    //   .join('users', 'user_id', 'users.id')
    //   .join('images', 'posts.id', 'post_id')
    //   .where('posts.id', id);
    return 'postDetail[0]';
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
