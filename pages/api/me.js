export default async (req, res) => {
  const accessToken = req.cookies.access_token;
  console.log('access token is ' + JSON.stringify(req.cookies));

  if (!accessToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    const user = await response.json();
    res.json({ user });
    res.status(200);
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};