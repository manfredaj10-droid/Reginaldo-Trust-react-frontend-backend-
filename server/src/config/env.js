import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@reginaldotrust.org',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'reginaldo2026',
  JWT_SECRET: process.env.JWT_SECRET || 'reginaldo-trust-secret-key-2026-secure',
  DB_PATH: process.env.DB_PATH 
    ? path.resolve(__dirname, '../../../', process.env.DB_PATH)
    : path.resolve(__dirname, '../../data/database.sqlite')
};
