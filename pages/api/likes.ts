import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@pages/api/auth/[...nextauth]';
import { removeLike, addLike } from '@util/dbUtil';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const { playlistId, roundId, userId } = req.body;
      await addLike(playlistId, roundId, userId);
      res.status(200).end();
    } catch (error: any) {
      console.error('error sending like to db', error.message);
      res.status(500).end();
    }
  } else if (req.method === 'DELETE') {
    try {
      const { playlistId, roundId, userId } = req.query;
      await removeLike(playlistId, roundId, userId);
      res.status(200).end();
    } catch (error: any) {
      console.error('error fetching likes from db', error.message);
      res.status(500).end();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Use POST or DELETE' });
  }
}
