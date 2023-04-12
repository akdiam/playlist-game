import { Playlist, SubmissionListProps } from '@/const/interface';
import { PlaylistEntry } from './PlaylistEntry';
import React, { useState, useRef, useEffect, useMemo } from 'react';

export const SubmissionList = (props: SubmissionListProps) => {
  const playlists: Playlist[] = props.renderedPlaylists;
  const [selected, setSelected] = useState(0);

  const itemRefs = useRef<React.RefObject<HTMLLIElement>[]>(
    playlists.map(() => React.createRef<HTMLLIElement>())
  );

  const handleSelect = (selectedIndex: number) => {
    props.handleClick(props.renderedPlaylists[selectedIndex], selectedIndex + 1);
    setSelected(selectedIndex);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      selected > 0 && handleSelect(selected - 1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      selected + 1 < props.renderedPlaylists.length && handleSelect(selected + 1);
    }
  };

  const scrollToSelectedItem = () => {
    const currentItemRef = itemRefs.current[selected].current;
    if (currentItemRef) {
      currentItemRef.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  useEffect(() => {
    scrollToSelectedItem();
  }, [selected]);

  return (
    <ul
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`w-full md:w-1/3 md:border-l-2 border-gray-700 focus:outline-none overflow-auto md:overflow-visible`}
    >
      {playlists.map((playlist, i) => (
        <li
          ref={itemRefs.current[i]}
          key={playlist.id}
          className={`border-b w-full border-gray-700 border-dotted flex flex-row justify-between h-30 hover:cursor-pointer ${
            playlist?.id !== props.featuredPlaylist.id && 'hover:bg-green-200'
          } ${
            playlist?.id === props.featuredPlaylist.id
              ? 'bg-black text-white'
              : 'bg-white text-black'
          }`}
          onClick={() => handleSelect(i)}
        >
          <PlaylistEntry playlist={playlist} rank={i + 1} isLiked={false} />
        </li>
      ))}
    </ul>
  );
};
