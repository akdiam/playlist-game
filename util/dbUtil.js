import pool from "../lib/db";

const PAGE_SIZE = 100;

export async function submitPlaylist(id, playlistId, userId, name, currentDate, currentTime, roundId) {
  // Check if the user has already submitted a playlist today
  // Replace 'your_schema_name' with your actual schema name
  /*const { rows } = await pool.query(
    `SELECT COUNT(*) AS submissions_count
     FROM your_schema_name.playlist_submissions
     WHERE submitted_by = $1
     AND DATE(submission_date) = CURRENT_DATE;`,
    [userId]
  );

  if (parseInt(rows[0].submissions_count) > 0) {
    throw new Error('User has already submitted a playlist today.');
  }*/

  // Submit the new playlist
  await pool.query(
    `INSERT INTO playlistgame.playlists (id, playlist_id, user_id, name, submission_date, submission_time, round_id)
     VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME, $5);`,
    [id, playlistId, userId, name, roundId]
  );

  return 'Playlist submitted successfully.';
}

// Get page n of round i
export async function getPlaylists(page, roundId) {
  const res = await pool.query(
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
  
  return JSON.parse(JSON.stringify(res.rows));
}

// Should do 2 things:
// 1. Check - does this user exist in db yet? If not, add to db
// 2. Check - has this user submitted a playlist today?
export async function validateUser() {

}