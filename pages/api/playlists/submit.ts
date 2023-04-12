import { randomUUID } from 'crypto';
import { submitPlaylist } from '../../../util/dbUtil';
import { getPlaylistInfo } from '../../../util/spotify';
import { Playlist } from '@const/interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: Session | null = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const playlistInfoFromSpotify = await getPlaylistInfo(
        req.body.spotifyId,
        session?.accessToken ?? ''
      );
      const id = req.body.id ? req.body.id : randomUUID();
      const spotifyId = req.body.spotifyId;
      const userId = session.user?.id;
      const name = playlistInfoFromSpotify.name;
      const roundId = req.body.roundId;
      const coverImageSrc = playlistInfoFromSpotify.images[0].url;

      let submittedPlaylist: Playlist = await submitPlaylist(
        id,
        spotifyId,
        userId,
        name,
        roundId,
        coverImageSrc
      );
      if (session.user?.name) {
        submittedPlaylist.display_name = session.user.name;
      }
      res.status(200).json({ submittedPlaylist });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
}
