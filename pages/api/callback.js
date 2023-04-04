import { stringify } from 'querystring';

export default async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing code query parameter' });
  }

  const params = {
    code,
  };

  res.redirect(`/api/login?${stringify(params)}`);
};