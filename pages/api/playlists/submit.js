import { randomUUID } from 'crypto';
import { submitPlaylist } from '../../../util/dbUtil';
import { getPlaylistInfo } from '../../../util/spotify';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const playlistInfo = await getPlaylistInfo(req.body.playlistId, req.cookies.access_token);
      const id = randomUUID();
      const playlistId = req.body.playlistId;
      const userId = req.body.userId;
      const name = playlistInfo.name;
      const currentDate = new Date().toISOString().slice(0, 10);
      const currentTime = new Date().toISOString();
      console.log(currentTime);
      const roundId = req.body.roundId;

      const message = await submitPlaylist(id, playlistId, userId, name, currentDate, currentTime, roundId);
      res.status(200).json({ message });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
}