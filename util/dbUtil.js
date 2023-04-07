import { randomUUID } from 'crypto';
import pool from '../lib/db';

const PAGE_SIZE = 100;

export async function submitPlaylist(id, playlistId, userId, name, roundId, coverImageSrc) {
  const { rows } = await pool.query(
    `WITH ins AS (
      INSERT INTO playlistgame.playlists (id, playlist_id, user_id, name, submission_date, submission_time, round_id, cover_image_src)
      VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        cover_image_src = EXCLUDED.cover_image_src
      RETURNING id, name, cover_image_src
    )

    SELECT p.id, p.playlist_id, p.user_id, ins.name, p.submission_date, p.submission_time, p.round_id, ins.cover_image_src, COUNT(v.id) as votes
      FROM ins
      LEFT JOIN playlistgame.playlists p ON ins.id = p.id
      LEFT JOIN playlistgame.votes v ON p.id = v.playlist_id
      GROUP BY p.id, ins.name, ins.cover_image_src;`,
    [id, playlistId, userId, name, roundId, coverImageSrc]
  );

  console.log(rows);

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

/**
 * Returns user's submitted playlist for roundId, if it exists.
 * If user doesn't exist in DB, create user.
 * @param {Record<string, any>} spotifyUser
 * @param {string} roundId
 * @returns {Playlist | null}
 */
export async function getSubmittedPlaylist(spotifyUser, roundId) {
  const id = randomUUID();

  try {
    const { rows } = await pool.query(
      `WITH user_check AS (
        INSERT INTO playlistgame.users (id, user_id, display_name)
        SELECT $1, $2, $3
        WHERE NOT EXISTS (
          SELECT 1
          FROM playlistgame.users u
          WHERE u.user_id = $2
        )
      )

      SELECT *
      FROM playlistgame.playlists p
      WHERE p.user_id = $2
      AND p.round_id = $4
      ORDER BY
        p.submission_date ASC,
        p.submission_time ASC;`,
      [id, spotifyUser.id, spotifyUser.display_name, roundId]
    );

    if (rows.length > 0) {
      return JSON.parse(JSON.stringify(rows));
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}
