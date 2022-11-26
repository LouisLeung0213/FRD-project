import { config } from 'dotenv';
import populateEnv from 'populate-env';

config();

export let env = {
  NODE_ENV: '',
  POSTGRES_DB: '',
  POSTGRES_USER: '',
  POSTGRES_PASSWORD: '',
  DB_PORT: 0,
  DB_HOST: '',
  PORT: '',
  HOST: "localhost",
  STRIPE_KEY: '',
  PUBLIC_STRIPE_KEY: '',
};

populateEnv(env, { mode: 'halt' });
