import { Comment } from '@/const/interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

import { getComments, sendComment } from '@/util/dbUtil';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const { playlistId, roundId, userId } = req.body;
      const sentComment: Comment = await sendComment(playlistId, roundId, userId);
      res.status(200).json({ sentComment });
    } catch (error: any) {
      console.error('error sending like to db', error.message);
      res.status(500).end();
    }
  } else if (req.method === 'GET') {
    try {
      const { playlistId, roundId } = req.query;
      const submissionComments: Comment[] = await getComments(playlistId, roundId);
      res.status(200).json({ submissionComments });
    } catch (error: any) {
      console.error('error fetching likes from db', error.message);
      res.status(500).end();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Use POST' });
  }
}
