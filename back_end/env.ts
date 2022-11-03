import { config } from 'dotenv';
import populateEnv from 'populate-env';

config();

export let env = {
  NODE_ENV: '',
  DB_NAME: '',
  DB_USER: '',
  DB_PASSWORD: '',
  PORT: '',
};

populateEnv(env, { mode: 'halt' });
