import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config();

let sqlInstance: ReturnType<typeof neon> | null = null;

const getSql = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Configure backend/.env before using database features.');
  }

  if (!sqlInstance) {
    sqlInstance = neon(process.env.DATABASE_URL);
  }

  return sqlInstance;
};

const sql = new Proxy({}, {
  get(_target, prop) {
    return Reflect.get(getSql(), prop);
  },
  apply(_target, _thisArg, args) {
    return Reflect.apply(getSql() as any, _thisArg, args);
  },
}) as any;

export default sql;