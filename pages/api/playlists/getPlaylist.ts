import { getPlaylistInfo } from '@/util/spotify';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const accessToken = req.cookies.access_token;
    const playlistId = req.body.playlistId;

    const res = await getPlaylistInfo(playlistId, accessToken);
  } else {
    res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }
}
