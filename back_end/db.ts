import { env } from './env';
import Knex from 'knex';
let profiles = require('./knexfile');
let profile = profiles[env.NODE_ENV];
// console.log(env.NODE_ENV);

export let knex = Knex(profile);
