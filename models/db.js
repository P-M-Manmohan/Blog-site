import pg from "pg";
import "dotenv/config";
const {Pool} =pg;

const ENV=process.env

const db = new Pool({
    user: ENV.DB_USERNAME,
    host: ENV.HOST,
    database: ENV.DATABASE,
    password: ENV.PASSWORD,
    port: 5432,
  });

export default db;