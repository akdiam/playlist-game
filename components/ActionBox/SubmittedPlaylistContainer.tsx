import Image from 'next/image';
import { useState } from 'react';

import { submittedPlaylistContainerProps } from '@const/interface';

export const SubmittedPlaylistContainer = (props: submittedPlaylistContainerProps) => {
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [isRemovalLoading, setIsRemovalLoading] = useState(false);
  const [isRemovalConfirmationActive, setIsRemovalConfirmationActive] = useState(false);

  const spotifyPlaylistUrl = 'https://open.spotify.com/playlist/';

  const handleSync = async (event: any) => {
    setIsSyncLoading(true);
    await props.handleSync(event);
    setIsSyncLoading(false);
  };

  const handleRemove = async () => {
    setIsRemovalLoading(true);
    try {
      const response = await fetch('/api/playlists/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: props.submittedPlaylist?.id,
        }),
      });
      response.status === 200 && props.setSubmittedPlaylist(null);
    } catch (err) {
      console.error(err);
    }

    setIsRemovalConfirmationActive(false);
    setIsRemovalLoading(false);
  };

  return (
    <>
      <div className="text-2xl mb-3">your submission:</div>
      <div className="w-full md:w-1/2 lg:w-1/3 flex p-3 border border-black rounded-xl shadow-sm">
        <a href={spotifyPlaylistUrl + props.submittedPlaylist.spotify_id + '?go=1'}>
          <Image
            className="rounded-md object-cover border border-black"
            src={props.submittedPlaylist.cover_image_src}
            width={250}
            height={250}
            alt={props.submittedPlaylist.name}
          />
        </a>
        <div className="pl-3 w-full flex flex-wrap flex-col justify-between">
          <div>
            <div className="flex-wrap text-lg md:text-xl font-bold mb-2 leading-tight line-clamp-2 break-all">
              {props.submittedPlaylist.name}
            </div>
            <div className="text-xs md:text-sm">
              {isRemovalConfirmationActive && (
                <>
                  {isRemovalLoading && <div>removing submission...</div>}
                  {!isRemovalLoading && (
                    <>
                      <div>proceed with removal?</div>
                      <button
                        onClick={handleRemove}
                        className="mr-2 mt-1 border border-red-700 text-red-700 hover:bg-red-500 hover:text-white py-1 px-3 rounded-md"
                      >
                        remove
                      </button>
                      <button
                        onClick={() => setIsRemovalConfirmationActive(false)}
                        className="border border-black text-black hover:bg-black hover:text-white py-1 px-3 rounded-md"
                      >
                        cancel
                      </button>
                    </>
                  )}
                </>
              )}
              {!isRemovalConfirmationActive && (
                <button
                  onClick={() => setIsRemovalConfirmationActive(true)}
                  className="text-red-700 border border-gray-400 hover:bg-gray-100 hover:text-white py-1 px-3 rounded-md"
                >
                  <Image src="trash.svg" alt="remove submission" width={18} height={20} />
                </button>
              )}
            </div>
          </div>
          <div className="text-xs italic font-thin">
            {!isSyncLoading && (
              <>
                <span className="underline hover:cursor-pointer" onClick={handleSync}>
                  click here
                </span>{' '}
                to sync name & cover image.
              </>
            )}
            {isSyncLoading && <span>syncing with Spotify...</span>}
          </div>
        </div>
      </div>
    </>
  );
};
