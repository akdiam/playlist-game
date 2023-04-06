import Image from 'next/image';
import { useState } from 'react';

import { ActionBoxProps, Playlist } from '@/const/interface';
import { extractPlaylistId } from '@/util/spotify';

export const ActionBox = (props: ActionBoxProps) => {
  const [submittedPlaylist, setSubmittedPlaylist] = useState<Playlist | null>(
    props.submittedPlaylist
  );
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [playlistInputValue, setPlaylistInputValue] = useState('');

  const spotifyAuthUrl =
    'https://accounts.spotify.com/authorize?client_id=28abf050734148e7a3204c9be8368811&response_type=code&redirect_uri=http://localhost:3000/api/callback&scope=user-read-private&';
  const spotifyPlaylistUrl = 'https://open.spotify.com/playlist/';

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitLoading(true);
    setIsSyncLoading(true);

    try {
      const response = await fetch('/api/playlists/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistId: submittedPlaylist
            ? submittedPlaylist.playlist_id
            : extractPlaylistId(playlistInputValue),
          userId: props.spotifyUser?.id,
          roundId: 'hi',
          displayName: props.spotifyUser?.display_name,
          id: submittedPlaylist?.id,
        }),
      });
      const responseJson: any = await response.json();
      setSubmittedPlaylist(responseJson.submittedPlaylist);
    } catch (err) {
      console.error(err);
    }

    setIsSubmitLoading(false);
    setIsSyncLoading(false);
  };

  const handleInputChange = (event: any) => {
    setPlaylistInputValue(event.target.value);
  };

  return (
    <>
      {props.spotifyUser === null && (
        <>
          <h2 className="text-2xl mb-2">to participate:</h2>
          <a href={spotifyAuthUrl}>
            <button className="border border-gray-400 rounded-md px-3 py-1">
              Login with Spotify
            </button>
          </a>
        </>
      )}
      {props.spotifyUser !== null && (
        <div>
          {submittedPlaylist && (
            <>
              <div className="text-2xl mb-3">your submission:</div>
              <div className="w-full md:w-1/2 flex p-3 border border-black text-black rounded-xl shadow-sm">
                <a href={spotifyPlaylistUrl + submittedPlaylist.playlist_id}>
                  <Image
                    className="rounded-md object-cover border border-black"
                    src={submittedPlaylist.cover_image_src}
                    width={200}
                    height={200}
                    alt={submittedPlaylist.name}
                  />
                </a>
                <div className="pl-3 w-full flex flex-wrap flex-col justify-between">
                  <div>
                    <div className="flex-wrap text-lg md:text-xl font-bold mb-2 leading-tight line-clamp-2 md:line-clamp-3 break-all">
                      {submittedPlaylist.name}
                    </div>
                    <div className="text-xs md:text-sm">
                      <button className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-700 py-1 px-3 rounded-md">
                        remove submission
                      </button>
                    </div>
                  </div>
                  <div className="text-xs italic font-thin">
                    {!isSyncLoading && (
                      <>
                        <span
                          className="underline hover:cursor-pointer"
                          onClick={handleSubmit}
                        >
                          click here
                        </span>{' '}
                        to sync playlist name & cover image.
                      </>
                    )}
                    {isSyncLoading && <span>syncing with Spotify...</span>}
                  </div>
                </div>
              </div>
            </>
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
        </div>
      )}
    </>
  );
};

const SubmissionForm = () => {};
