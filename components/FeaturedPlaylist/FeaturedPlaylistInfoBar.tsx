import Image from 'next/image';

import { FeaturedPlaylistInfoBarProps, Playlist } from '@/const/interface';
import { useEffect, useState } from 'react';
import { localDateTime } from '@/util/stringUtil';

export const FeaturedPlaylistInfoBar = (props: FeaturedPlaylistInfoBarProps) => {
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);
  const [localDateTimeString, setLocalDateTimeString] = useState('');
  const spotifyProfileUrl = 'https://open.spotify.com/user/';

  const addLike = async () => {
    // only execute if not already liked by user
    props.dispatch({
      type: 'updateLikes',
      playlist: props.playlist,
      likes: `${+props.playlist.likes + 1}`,
      isLiked: true,
    });

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.user?.id,
          roundId: props.playlist.round_id,
          playlistId: props.playlist.id,
        }),
      });

      if (!response.ok) {
        props.dispatch({
          type: 'updateLikes',
          playlist: props.playlist,
          likes: `${+props.playlist.likes - 1}`,
          isLiked: false,
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const removeLike = async () => {
    props.dispatch({
      type: 'updateLikes',
      playlist: props.playlist,
      likes: `${+props.playlist.likes - 1}`,
      isLiked: false,
    });

    try {
      const params = new URLSearchParams({
        playlistId: props.playlist.id,
        roundId: props.playlist.round_id,
        userId: props.user?.id ?? '',
      });

      const response = await fetch(`/api/likes?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });

      if (!response.ok) {
        props.dispatch({
          type: 'updateLikes',
          playlist: props.playlist,
          likes: `${+props.playlist.likes + 1}`,
          isLiked: true,
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLocalDateTimeString(
      localDateTime(props.playlist.submission_date, props.playlist.submission_time)
    );
  }, [props.playlist.id]);

  return (
    <div className="grid grid-cols-7 md:border border-black md:mb-3 p-3 rounded-none md:rounded-xl text-black">
      <div className="col-span-6 flex flex-col w-auto">
        <div className="text-2xl font-bold truncate pb-1">
          {props.rank}.&nbsp; {props.playlist.name}
        </div>
        <div className="font-thin text-sm">
          <i>
            submitted by{' '}
            <a href={spotifyProfileUrl + props.playlist.user_id}>{props.playlist.display_name}</a>
            &nbsp; {localDateTimeString}
          </i>
        </div>
      </div>
      <div className="col-span-1 max-w-36 my-auto pl-3">
        {props.user && (
          <>
            {!props.playlist.is_liked && (
              <button
                onMouseEnter={() => setIsHoveringHeart(true)}
                onMouseLeave={() => setIsHoveringHeart(false)}
                onClick={addLike}
                className="text-gray-400 hover:text-[#FF4E4E] bg-white w-full rounded-md"
              >
                <Image
                  className="mx-auto"
                  src={isHoveringHeart ? 'like_hover.svg' : 'like_empty.svg'}
                  alt="like submission"
                  width={30}
                  height={20}
                />
                {props.playlist.likes}
              </button>
            )}
            {props.playlist.is_liked && (
              <button onClick={removeLike} className="my-auto w-full rounded-md text-[#FF4E4E]">
                <Image
                  className="mx-auto"
                  src="like_filled.svg"
                  alt="like submission"
                  width={30}
                  height={20}
                />
                {props.playlist.likes}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
