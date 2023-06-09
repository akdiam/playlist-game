import Image from 'next/image';

import { PlaylistEntryProps } from '@const/interface';
import { timeAgo } from '@util/stringUtil';

export const PlaylistEntry = (props: PlaylistEntryProps) => {
  const displayTime = timeAgo(props.playlist.submission_date, props.playlist.submission_time);

  return (
    <div className="grid grid-cols-12 w-full py-3 px-3 items-start">
      <div className="col-span-2 max-w-24 grid-rows-2">
        <div className="row-span-1 text-xl mb-1">{props.rank}.</div>
        <div className="row-span-1 text-xs font-thin">
          <i>{props.playlist.likes} likes</i>
        </div>
      </div>
      <div className="col-span-9 ml-2 flex flex-col w-auto grid-rows-2">
        <div className="row-span-1 font-bold text-xl mb-1 truncate">
          {props.playlist.name.length > 0 && <span>{props.playlist.name}</span>}
          {props.playlist.name.length === 0 && <span>&empty;</span>}
        </div>
        <div className="hidden md:block row-span-1 text-xs font-thin truncate">
          <i>{`submitted by ${props.playlist.display_name} ${displayTime}`}</i>
        </div>
        <div className="block md:hidden row-span-1 text-xs font-thin truncate">
          <i>
            {props.playlist.display_name} &#x2022; {displayTime}
          </i>
        </div>
      </div>
      <div className="col-span-1 max-w-24 place-self-center">
        {props.playlist.is_liked && (
          <Image src="like_filled.svg" alt="like submission" width={15} height={10} />
        )}
      </div>
    </div>
  );
};
