import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PLAYLIST_GAME_DB_HOST,
  port: process.env.PLAYLIST_GAME_DB_PORT,
  user: process.env.PLAYLIST_GAME_DB_USER,
  password: process.env.PLAYLIST_GAME_DB_PASSWORD,
  database: process.env.PLAYLIST_GAME_DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;