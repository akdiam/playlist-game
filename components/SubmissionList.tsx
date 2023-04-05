import { SubmissionListProps } from "@/const/interface";
import { PlaylistEntry } from "./PlaylistEntry";

export const SubmissionList = (props: SubmissionListProps) => {
 return (
  <ul className={`w-full md:w-1/2 border-r-2 border-gray-700`}>
    {props.renderedPlaylists.map((playlist, i) => (
      <li
        key={playlist.id}
        className={`border-b w-full border-gray-700 border-dotted flex flex-row justify-between h-30 hover:cursor-pointer ${playlist?.id !== props.featuredPlaylist.id && 'hover:bg-green-200'} ${playlist?.id === props.featuredPlaylist.id ? 'bg-black text-white' : 'bg-white text-black'}`}
        onClick={() => props.handleClick(playlist, i + 1)}
      >
        <PlaylistEntry playlist={playlist} rank={i + 1} isLiked={false} />
      </li>
    ))}
  </ul>
 )
};