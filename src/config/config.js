import dotenv from 'dotenv';

// Load env once for modules that import this file directly
dotenv.config();

const requireEnv = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // MySQL
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,

  // Mongo (legacy) is intentionally ignored
  // MONGO_URI: process.env.MONGO_URI,
};

export const assertRequiredMySqlEnv = () => {
  requireEnv('DB_NAME');
  requireEnv('DB_USER');
  // DB_PASSWORD can be empty string but must exist
  if (process.env.DB_PASSWORD === undefined) throw new Error('Missing required environment variable: DB_PASSWORD');
  requireEnv('DB_HOST');
};

