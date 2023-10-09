import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
})

export const promisePool = pool 