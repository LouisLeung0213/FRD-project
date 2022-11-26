import { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const txn = await knex.transaction();
  try {
    // Deletes ALL existing entries
    await txn('users').del();

    // Inserts seed entries
    let password_hash = await bcrypt.hash('123', 10);
    let users = await txn('users').insert([
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

    await txn('store_location').insert([
      { location: 'notAvailable' },
      {
        location: '荃灣西',
      },
    ]);

    await txn.commit();
    return;
  } catch (error) {
    await txn.rollback();
    console.log(error as any);
    return;
  }
}
