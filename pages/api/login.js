import axios from 'axios';
import cookie from 'cookie';

export default async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: `http://localhost:3000/api/callback`,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    const accessTokenCookie = cookie.serialize('access_token', access_token, {
      maxAge: expires_in,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });

    res.setHeader('Set-Cookie', [accessTokenCookie]);
    res.writeHead(302, { Location: '/' });
    res.end();
  } catch (error) {
    console.error('Error in /api/auth/login:', error.response?.data || error.message || error);
    res
      .status(500)
      .json({ error: 'Login failed', details: error.response?.data || error.message || error });
  }
};
