import pool from "../lib/db";

const PAGE_SIZE = 100;

export async function submitPlaylist(id, playlistId, userId, name, roundId) {
  const { rows } = await pool.query(
    `INSERT INTO playlistgame.playlists (id, playlist_id, user_id, name, submission_date, submission_time, round_id)
     VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME, $5)
     RETURNING *;`,
    [id, playlistId, userId, name, roundId]
  );

  return rows && rows.length > 0 ? JSON.parse(JSON.stringify(rows[0])) : null;
}

// Get page n of round i
export async function getPlaylists(page, roundId) {
  const { rows } = await pool.query(
    `SELECT
      p.id,
      p.playlist_id,
      p.user_id,
      u.display_name,
      p.name,
      p.submission_date,
      p.submission_time,
      p.round_id,
      COUNT(v.playlist_id) as votes
    FROM
      playlistgame.playlists p
      JOIN playlistgame.users u ON p.user_id = u.user_id
      LEFT JOIN playlistgame.votes v ON p.playlist_id = v.playlist_id
    WHERE
      p.round_id = '${roundId}'
    GROUP BY
      p.id,
      p.playlist_id,
      p.user_id,
      u.display_name,
      p.name,
      p.submission_date,
      p.submission_time,
      p.round_id
    ORDER BY
      COUNT(v.playlist_id) DESC,
      p.submission_date DESC,
      p.submission_time DESC
    LIMIT ${PAGE_SIZE} OFFSET ${page * PAGE_SIZE};`
  );
  
  return JSON.parse(JSON.stringify(rows));
}

// Should do 2 things:
// 1. Check - does this user exist in db yet? If not, add to db
// 2. Check - has this user submitted a playlist today?
export async function validateUser() {

}