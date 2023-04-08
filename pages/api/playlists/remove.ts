import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { removePlaylist } from '@/util/dbUtil';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'POST') {
    const submissionId = req.body.submissionId;
    try {
      const status = await removePlaylist(submissionId);
      res.status(status).end();
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
}
