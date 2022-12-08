import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const txn = await knex.transaction();
  try {
    // Deletes ALL existing entries
    await txn('users').del();

    // Inserts seed entries
    let password_hash = await bcrypt.hash('hotbidadmin@2022', 10);
    let icon_src = await txn('users').insert([
      {
        username: 'caleb',
        password_hash: password_hash,
        nickname: 'Caleb',
        phone: '12345678',
        email: '123@gmail.com',
        is_admin: true,
        points: 10000,
      },
      {
        username: 'Louis',
        password_hash: password_hash,
        nickname: 'louis',
        phone: '12345678',
        email: '123@gmail.com',
        is_admin: true,
        points: 10000,
      },
      {
        username: 'scott',
        password_hash: password_hash,
        nickname: 'Scott',
        phone: '12345678',
        email: '123@gmail.com',
        is_admin: true,
        points: 10000,
      },
      {
        username: 'alex',
        password_hash: password_hash,
        nickname: '美漫之達人',
        phone: '12345678',
        email: '123@gmail.com',
        is_admin: false,
        points: 10000,
      },
      {
        username: 'bob',
        password_hash: password_hash,
        nickname: '自由萬歲！',
        phone: '12345678',
        email: '123@gmail.com',
        is_admin: false,
        points: 10000,
      },
      {
        username: 'christy',
        password_hash: password_hash,
        nickname: '傾國公主',
        phone: '12345678',
        email: '123@gmail.com',
        is_admin: false,
        points: 10000,
      },
      {
        username: 'dada',
        password_hash: password_hash,
        nickname: '可愛乂比卡',
        phone: '12345678',
        email: '123@gmail.com',
        is_admin: false,
        points: 10000,
      },
    ]);

    await txn('banks').insert([
      { bank_name: '恆生銀行' },
      {
        bank_name: '匯豐銀行',
      },
      {
        bank_name: '中國銀行',
      },
      {
        bank_name: '渣打銀行',
      },
      {
        bank_name: '花旗銀行',
      },
      {
        bank_name: '大新銀行',
      },
    ]);

    await txn('bank_accounts').insert([
      { bank_account: '123456789123', user_id: '1', bank_id: '1' },
      { bank_account: '123456789123', user_id: '2', bank_id: '1' },
      { bank_account: '123456789123', user_id: '3', bank_id: '1' },
      { bank_account: '123456789123', user_id: '4', bank_id: '1' },
      { bank_account: '123456789123', user_id: '5', bank_id: '1' },
      { bank_account: '123456789123', user_id: '6', bank_id: '1' },
      { bank_account: '123456789123', user_id: '7', bank_id: '1' },
    ]);

    await txn('store_locations').insert([
      { location: 'notAvailable' },
      {
        location: '荃灣西',
      },
    ]);

    await txn('posts').insert([
      {
        user_id: '4',
        post_title: 'Hot toys 奇異博士',
        post_description: '9成新，法力無邊',
        original_price: 3000,
        q_mark: true,
        admin_title: 'Hot toys 奇異博士',
        admin_comment: '9成新，法力無邊',
        status: 'sold&out',
        post_time: '2022-11-01 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 4,
      },
      {
        user_id: '5',
        post_title: '進擊的團長',
        post_description: '獻出心臟！',
        original_price: 1000,
        q_mark: true,
        admin_title: '進擊的團長',
        admin_comment: '獻出心臟！',
        status: 'sold&out',
        post_time: '2022-11-02 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 5,
      },
      {
        user_id: '6',
        post_title: '貝兒',
        post_description: 'cute cute beauty, no beast',
        original_price: 650,
        q_mark: true,
        admin_title: '貝兒',
        admin_comment: 'cute cute beauty, no beast',
        status: 'selling',
        post_time: '2022-11-03 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 6,
      },      
      {
        user_id: '6',
        post_title: '勞蘇',
        post_description: '只剩43%士多啤梨味',
        original_price: 230,
        q_mark: true,
        admin_title: '勞蘇',
        admin_comment: '只剩43%士多啤梨味',
        status: 'selling',
        post_time: '2022-11-04 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 6,
      }, 
      {
        user_id: '4',
        post_title: 'Hot toys 回到未來呀伯',
        post_description: '表情精緻，4成新，平放',
        original_price: 100,
        q_mark: true,
        admin_title: 'Hot toys 回到未來呀伯',
        admin_comment: '表情精緻，4成新，平放',
        status: 'selling',
        post_time: '2022-11-05 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 4,
      },     
      {
        user_id: '5',
        post_title: '突擊自由',
        post_description: '大量放高達',
        original_price: 800,
        q_mark: true,
        admin_title: '突擊自由',
        admin_comment: '大量放高達',
        status: 'selling',
        post_time: '2022-11-06 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 5,
      },
      {
        user_id: '5',
        post_title: '元祖',
        post_description: '大量放高達',
        original_price: 800,
        q_mark: true,
        admin_title: '元祖',
        admin_comment: '大量放高達',
        status: 'selling',
        post_time: '2022-11-07 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 5,
      },
      {
        user_id: '7',
        post_title: '比卡超玩具',
        post_description: '由細玩到大，0.01成新，有意dm',
        original_price: 20,
        q_mark: false,
        status: 'selling',
        post_time: '2022-11-08 22:23:02.001428+08',
        priority: 0,
        location_id: 1,
        auto_adjust_plan: true,
      },
      {
        user_id: '4',
        post_title: '變形俠侶',
        post_description: '全新出售',
        original_price: 3000,
        q_mark: true,
        admin_title: '變形俠侶',
        admin_comment: '全新出售',
        status: 'selling',
        post_time: '2022-11-09 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 4,
      },
      {
        user_id: '4',
        post_title: '美國女隊長',
        post_description: '全新出售',
        original_price: 3000,
        q_mark: true,
        admin_title: '美國女隊長',
        admin_comment: '全新出售',
        status: 'pending_in',
        post_time: '2022-11-10 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 4,
      },
      {
        user_id: '5',
        post_title: '鼬太知',
        post_description: '左眼全新，右眼一成新',
        original_price: 1200,
        q_mark: true,
        admin_title: '鼬太知',
        admin_comment: '左眼全新，右眼一成新',
        status: 'pending_in',
        post_time: '2022-11-11 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 5,
      },
      {
        user_id: '6',
        post_title: 'Elsa',
        post_description: '放置家中可以室溫下降攝氏5度，9成新',
        original_price: 4000,
        q_mark: true,
        admin_title: 'Elsa',
        admin_comment: '只剩43%放置家中可以室溫下降攝氏5度，9成新',
        status: 'pending_in',
        post_time: '2022-11-12 22:23:02.001428+08',
        priority: 0,
        location_id: 2,
        auto_adjust_plan: true,
        bank_references: 6,
      }, 
      {
        user_id: '6',
        post_title: '愛麗絲',
        post_description: '5成新，完美主義者退散',
        original_price: 500,
        q_mark: false,
        status: 'selling',
        post_time: '2022-11-13 22:23:02.001428+08',
        priority: 0,
        location_id: 1,
        auto_adjust_plan: true,
      }, 
    ]);

    await txn('images').insert([
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.40.52.png%2B1%2B1670474637516?alt=media&token=728ec2d9-c45b-486b-b9c7-62db19fc376d',
        post_id: 1,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F780d3dba9b731cc41a0efa2988db990a.jpg%2B2%2B1669993264270?alt=media&token=26900633-8cc1-46ed-a780-24c64a7860c4',
        post_id: 2,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.50.01.png%2B1%2B1670476310134?alt=media&token=60729434-4bfd-431c-9b7f-4f832b987330',
        post_id: 3,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.45.48.png%2B1%2B1670476028148?alt=media&token=63017463-b722-4569-a014-6d60fd3bdf60',
        post_id: 4,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.45.19.png%2B1%2B1670475988970?alt=media&token=9f9168a5-e5b9-4df1-9128-c88b87841c7f',
        post_id: 5,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.54.10.png%2B1%2B1670476449710?alt=media&token=0b780a6c-ae69-4009-8886-09aa58bbc5ac',
        post_id: 6,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.57.39.png%2B1%2B1670476486671?alt=media&token=33f0befe-9dd3-4d4f-b510-434ab80cc489',
        post_id: 7,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.58.30.png%2B1%2B1670476535529?alt=media&token=e4146874-a07b-4ac2-9e20-64b47658f5f7',
        post_id: 8,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.41.39.png%2B1%2B1670474653531?alt=media&token=c3ded163-2f4d-4f47-8ea6-bff5b519ba64',
        post_id: 9,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.46.01.png%2B1%2B1670476074677?alt=media&token=c5686234-48c2-4938-b2b1-34a85405daaf',
        post_id: 10,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.49.07.png%2B1%2B1670476192429?alt=media&token=35c094a9-eca1-4dce-96b3-15bea3e3ff29',
        post_id: 11,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.51.35.png%2B1%2B1670476239587?alt=media&token=53b4cc6a-a81a-4088-aa28-cfb0a85c9afa',
        post_id: 12,
      },
      {
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F%E8%9E%A2%E5%B9%95%E6%88%AA%E5%9C%96%202022-12-08%20%E4%B8%8B%E5%8D%8812.52.15.png%2B1%2B1670476276586?alt=media&token=e93779db-3809-4566-8bc4-ee9a35494c4f',
        post_id: 13,
      },
      
    ]);

    // console.log("Seed: users: ", icon_src[0].icon_src)
    // let real_icon_src = icon_src[0].icon_src.split("$1").join('?')

    // await txn('users')
    // .update({
    //   icon_src: real_icon_src
    // })

    await txn.commit();
    return;
  } catch (error) {
    await txn.rollback();
    console.log(error as any);
    return;
  }
}
