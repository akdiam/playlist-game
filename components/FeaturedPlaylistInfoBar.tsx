import { PlaylistEntryProps } from '@/const/interface';

export const FeaturedPlaylistInfoBar = (props: PlaylistEntryProps) => {
  const spotifyProfileUrl = 'https://open.spotify.com/user/';

  return (
    <div className="grid grid-cols-7 border border-slate-400 bg-slate-100 mb-6 p-3 rounded-xl text-slate-600">
      <div className="col-span-6 flex flex-col w-auto">
        <div className="text-2xl font-bold truncate pb-1">
          {props.rank}.&nbsp; {props.playlist.name}
        </div>
        <div className="font-thin text-sm">
          <i>
            submitted by{' '}
            <a href={spotifyProfileUrl + props.playlist.user_id}>
              {props.playlist.display_name}
            </a>
          </i>
          &nbsp;|&nbsp;
          <i>{props.playlist.votes} votes</i>
        </div>
      </div>
      <div className="col-span-1 max-w-36 my-auto pl-3">
        <button className="border border-slate-400 py-1 w-full rounded-md">
          like
        </button>
      </div>
    </div>
  );
};
