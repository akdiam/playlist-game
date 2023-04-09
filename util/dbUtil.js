import { randomUUID } from 'crypto';
import pool from '../lib/db';

const PAGE_SIZE = 100;

export async function submitPlaylist(id, spotifyId, userId, name, roundId, coverImageSrc) {
  const { rows } = await pool.query(
    `WITH ins AS (
      INSERT INTO playlistgame.playlists (id, playlist_id, user_id, name, submission_date, submission_time, round_id, cover_image_src)
      VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        cover_image_src = EXCLUDED.cover_image_src
      RETURNING id, name, cover_image_src
    )

    SELECT p.id, p.spotify_id, p.user_id, ins.name, p.submission_date, p.submission_time, p.round_id, ins.cover_image_src, COUNT(l.id) as likes
      FROM ins
      LEFT JOIN playlistgame.playlists p ON ins.id = p.id
      LEFT JOIN playlistgame.likes l ON p.id = l.playlist_id
      GROUP BY p.id, ins.name, ins.cover_image_src;`,
    [id, spotifyId, userId, name, roundId, coverImageSrc]
  );

  return rows && rows.length > 0 ? JSON.parse(JSON.stringify(rows[0])) : null;
}

export async function removePlaylist(submissionId) {
  try {
    await pool.query(`DELETE FROM playlistgame.playlists WHERE id = $1;`, [submissionId]);
    return 200;
  } catch (e) {
    return 500;
  }
}

// Get page n of round i
export async function getPlaylists(page, roundId, userId) {
  const { rows } = await pool.query(
    `SELECT
      p.id,
      p.spotify_id,
      p.user_id,
      u.name AS display_name,
      p.name,
      p.submission_date,
      p.submission_time,
      p.round_id,
      COUNT(l.playlist_id) as likes,
      CASE
        WHEN COUNT(l2.playlist_id) > 0 THEN true
        ELSE false
      END AS is_liked
    FROM
      playlistgame.playlists p
      JOIN auth."User" u ON p.user_id = u.id
      LEFT JOIN playlistgame.likes l ON p.id = l.playlist_id
      LEFT JOIN playlistgame.likes l2 ON p.id = l2.playlist_id AND l2.round_id = $1 AND l2.user_id = $2
    WHERE
      p.round_id = $1
    GROUP BY
      p.id,
      p.spotify_id,
      p.user_id,
      u.name,
      p.name,
      p.submission_date,
      p.submission_time,
      p.round_id
    ORDER BY
      COUNT(l.playlist_id) DESC,
      p.submission_date DESC,
      p.submission_time DESC
    LIMIT ${PAGE_SIZE} OFFSET ${page * PAGE_SIZE};`,
    [roundId, userId]
  );

  return JSON.parse(JSON.stringify(rows));
}

/**
 * Returns user's submitted playlist for roundId, if it exists.
 * @param {Record<string, any>} user
 * @param {string} roundId
 * @returns {Playlist | null}
 */
export async function getSubmittedPlaylist(userId, roundId) {
  try {
    const { rows } = await pool.query(
      `SELECT *
      FROM playlistgame.playlists p
      WHERE p.user_id = $1
      AND p.round_id = $2
      ORDER BY
        p.submission_date ASC,
        p.submission_time ASC;`,
      [userId, roundId]
    );

    if (rows.length > 0) {
      return JSON.parse(JSON.stringify(rows));
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function sendComment(content, playlistId, roundId, userId, displayName) {
  const id = randomUUID();

  const { rows } = await pool.query(
    `INSERT INTO playlistgame.comments (id, playlist_id, round_id, user_id, time_submitted, content, display_name)
     VALUES($1, $2, $3, $4, NOW(), $5, $6)
     RETURNING *;`,
    [id, playlistId, roundId, userId, content, displayName]
  );

  return JSON.parse(JSON.stringify(rows[0]));
}

export async function getComments(playlistId, roundId) {
  const { rows } = await pool.query(
    `SELECT * 
     FROM playlistgame.comments c
     WHERE c.playlist_id = $1
     AND c.round_id = $2
     ORDER BY c.time_submitted ASC;`,
    [playlistId, roundId]
  );

  return JSON.parse(JSON.stringify(rows));
}

export async function addLike(playlistId, roundId, userId) {
  const id = randomUUID();
  await pool.query(
    `INSERT INTO playlistgame.likes (id, playlist_id, round_id, user_id)
     SELECT $1, $2, $3, $4
     WHERE NOT EXISTS (
      SELECT 1
      FROM playlistgame.likes
      WHERE playlist_id = $2
        AND round_id = $3
        AND user_id = $4
     );`,
    [id, playlistId, roundId, userId]
  );
}

export async function removeLike(playlistId, roundId, userId) {
  await pool.query(
    `DELETE from playlistgame.likes
     WHERE playlist_id = $1
       AND round_id = $2
       AND user_id = $3;`,
    [playlistId, roundId, userId]
  );
}
