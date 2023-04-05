import Image from 'next/image';
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion'; 

import { ActionBoxProps, Playlist } from "@/const/interface";
import { extractPlaylistId } from '../util/spotify';

export const ActionBox = (props: ActionBoxProps) => {
  const [submittedPlaylist, setSubmittedPlaylist] = useState<Playlist | null>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [playlistInputValue, setPlaylistInputValue] = useState('');

  const spotifyAuthUrl = 'https://accounts.spotify.com/authorize?client_id=28abf050734148e7a3204c9be8368811&response_type=code&redirect_uri=http://localhost:3000/api/callback&scope=user-read-private&';

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitLoading(true);

    try {
      const response = await fetch('/api/playlists/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistId: extractPlaylistId(playlistInputValue), userId: props.spotifyUser?.id, roundId: 'hi', displayName: props.spotifyUser?.display_name })
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

  const iframeVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1 },
  };

  const iframeTransition = {
    duration: 0.15,
    ease: 'easeOut',
  };

  return (
    <>
      {props.spotifyUser === null && (
        <>
          <h2 className='text-2xl mb-2'>to participate:</h2>
          <a href={spotifyAuthUrl}>
            <button className='border border-gray-400 rounded-md px-3 py-1'>
              Login with Spotify
            </button>
          </a>
        </>
      )}
      {props.spotifyUser !== null && (
        <div key={submittedPlaylist ? 'submitted' : 'notSubmitted'}>
          {submittedPlaylist && (
            <>
              <div className='text-2xl mb-3'>your submission:</div>
              <motion.div 
                className='w-1/2 flex p-3 border border-slate-400 bg-slate-100 text-slate-600 rounded-xl'
                key={submittedPlaylist.playlist_id}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={iframeVariants}
                transition={iframeTransition}
              >
                <Image
                  className='rounded-md object-cover'
                  src={submittedPlaylist?.cover_image ?? ''}
                  width={100}
                  height={100}
                  alt={submittedPlaylist.name}
                />
                <div className='pl-3 w-full'>
                  <div className='text-2xl w-full font-bold truncate'>{submittedPlaylist.name}</div>
                  <p className='font-thin w-full italic truncate'>refresh playlist | change submission</p>
                </div>
              </motion.div>
            </>
          )}
          {!submittedPlaylist && (
            <>
              <p className='pb-2 text-2xl'>to participate, submit your <strong>public</strong> Spotify playlist link below:</p>
              {isSubmitLoading && <p>submitting...</p>}
              {!isSubmitLoading && (<form onSubmit={handleSubmit}>
                <input
                  onChange={handleInputChange}
                  value={playlistInputValue}
                  className='bg-white border border-gray-400 rounded-md mr-2 p-1 focus:border-black focus:ring-black focus:outline-none' />
                <button className='border border-gray-400 rounded-md px-3 py-1 hover:bg-black hover:text-white hover:border-gray-200'>submit</button>
              </form>)}
            </>
          )}
        </div>
      )}
    </>
  );
};