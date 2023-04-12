import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';

import { ActionBoxProps, Playlist } from '@/const/interface';
import { extractPlaylistId } from '@/util/spotify';
import { SubmittedPlaylistContainer } from './SubmittedPlaylistContainer';

export const ActionBox = (props: ActionBoxProps) => {
  const [submittedPlaylist, setSubmittedPlaylist] = useState<Playlist | null>(
    props.submittedPlaylist
  );
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [playlistInputValue, setPlaylistInputValue] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitLoading(true);

    try {
      const response = await fetch('/api/playlists/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotifyId: submittedPlaylist
            ? submittedPlaylist.spotify_id
            : extractPlaylistId(playlistInputValue),
          userId: props.user?.id ?? '0',
          roundId: 'hi',
          displayName: props.user?.display_name ?? '0',
          id: submittedPlaylist?.id ?? null,
        }),
      });
      const responseJson: any = await response.json();
      setSubmittedPlaylist(responseJson.submittedPlaylist);
    } catch (err) {
      console.error(err);
    }

    setIsSubmitLoading(false);
  };

  const handleInputChange = (event: any) => {
    setPlaylistInputValue(event.target.value);
  };

  return (
    <div className="mb-6">
      {props.user === null && (
        <>
          <h2 className="text-2xl mb-2">to participate:</h2>
          <button
            onClick={() => signIn('spotify')}
            className="border border-gray-400 rounded-md px-3 py-1"
          >
            Login with Spotify
          </button>
        </>
      )}
      {props.user !== null && (
        <>
          {submittedPlaylist && (
            <SubmittedPlaylistContainer
              submittedPlaylist={submittedPlaylist}
              setSubmittedPlaylist={setSubmittedPlaylist}
              handleSync={handleSubmit}
            />
          )}
          {!submittedPlaylist && (
            <>
              <p className="pb-2 text-2xl">
                submit your <strong>public</strong> Spotify playlist link below:
              </p>
              {isSubmitLoading && <p>submitting...</p>}
              {!isSubmitLoading && (
                <form onSubmit={handleSubmit}>
                  <input
                    onChange={handleInputChange}
                    value={playlistInputValue}
                    className="bg-white border border-gray-400 rounded-md mr-2 p-1 focus:border-black focus:ring-black focus:outline-none"
                  />
                  <button className="border border-gray-400 rounded-md px-3 py-1 hover:bg-black hover:text-white hover:border-gray-200">
                    submit
                  </button>
                </form>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
