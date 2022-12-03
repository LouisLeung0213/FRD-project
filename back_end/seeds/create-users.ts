import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const txn = await knex.transaction();
  try {
    // Deletes ALL existing entries
    await txn('users').del();

    // Inserts seed entries
    let password_hash = await bcrypt.hash('123', 10);
    let icon_src = await txn('users').insert([
      {
        username: 'caleb',
        password_hash: password_hash,
        nickname: 'caleb',
        phone: '12345678',
        email: '123@gmail.com',
        points: 0,
        is_admin: true,
      },
      {
        username: 'louis',
        password_hash: password_hash,
        nickname: 'louis',
        phone: '12345678',
        email: '123@gmail.com',
        points: 0,
        is_admin: true,
      },
      {
        username: 'scott',
        password_hash: password_hash,
        nickname: 'scott',
        phone: '12345678',
        email: '123@gmail.com',
        points: 0,
        is_admin: true,
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
      { bank_account: '123', user_id: '1', bank_id: '1' },
      { bank_account: '123', user_id: '2', bank_id: '1' },
      { bank_account: '123', user_id: '3', bank_id: '1' },
    ]);

    await txn('store_locations').insert([
      { location: 'notAvailable' },
      {
        location: '荃灣西',
      },
    ]);

    await txn('posts').insert([
      {
        id: '1',
        user_id: '2',
        post_title: '333',
        post_description: 'title',
        original_price: 6500,
        q_mark: true,
        admin_title: '',
        admin_comment: '',
        status: 'selling',
        post_time: '2022-12-02 22:23:02.001428+08',
        priority: 0,
        location_id: 1,
        auto_adjust_plan: true,
        bank_references: 1,
      },
    ]);

    await txn('images').insert([
      {
        id: 1,
        src: 'https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/files%2F780d3dba9b731cc41a0efa2988db990a.jpg%2B2%2B1669993264270?alt=media&token=26900633-8cc1-46ed-a780-24c64a7860c4',
        post_id: 1,
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
