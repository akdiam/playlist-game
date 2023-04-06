import axios from 'axios';

export const extractPlaylistId = (playlistUrl: string) => {
  const matches = playlistUrl.match(/playlist\/(\w+)/);
  if (matches && matches.length >= 2) {
    return matches[1];
  } else {
    return null;
  }
}

export async function getSpotifyUser(accessToken: string) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function getPlaylistInfo(playlistId: string, accessToken: string) {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}?fields=name,images`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await response.data;
  } catch (error) {
    console.error('Error fetching playlist info:', error);
  }
}