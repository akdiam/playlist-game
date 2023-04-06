import { removePlaylist } from '@/util/dbUtil';

export default async function handler(req: any, res: any) {
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
