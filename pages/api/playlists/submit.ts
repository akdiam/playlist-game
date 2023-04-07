import { randomUUID } from 'crypto';
import { submitPlaylist } from '../../../util/dbUtil';
import { getPlaylistInfo } from '../../../util/spotify';
import { Playlist } from '@/const/interface';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const playlistInfoFromSpotify = await getPlaylistInfo(
        req.body.playlistId,
        req.cookies.access_token ?? ''
      );
      const id = req.body.id ? req.body.id : randomUUID();
      const playlistId = req.body.playlistId;
      const userId = req.body.userId;
      const name = playlistInfoFromSpotify.name;
      const roundId = req.body.roundId;
      const displayName = req.body.displayName;
      const coverImageSrc = playlistInfoFromSpotify.images[0].url;

      let submittedPlaylist: Playlist = await submitPlaylist(
        id,
        playlistId,
        userId,
        name,
        roundId,
        coverImageSrc
      );
      submittedPlaylist.display_name = displayName;
      res.status(200).json({ submittedPlaylist });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
}
