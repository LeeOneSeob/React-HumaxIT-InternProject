import Client from 'promise-mysql';
import { dbConfig } from './dbConfig';

// create DB pool
const pool = Client.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  db: dbConfig.db,
  connectionLimit: 10,
  charset: 'utf8',
  multipleStatements: true,
});

export const connect = fn => async (...args) => {
  const con = await pool.getConnection();

  try {
    const result = await fn(con, ...args);
    con.connection.release();
    return result;
  } catch (error) {
    con.connection.release();
    throw error;
  }
};

export const mysql = {};
