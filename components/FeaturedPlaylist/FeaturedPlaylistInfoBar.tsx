import { FeaturedPlaylistInfoBarProps } from '@/const/interface';

export const FeaturedPlaylistInfoBar = (props: FeaturedPlaylistInfoBarProps) => {
  const spotifyProfileUrl = 'https://open.spotify.com/user/';

  const addLike = async () => {
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

      if (response.ok) {
        // set like state
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const removeLike = () => {};

  return (
    <div className="grid grid-cols-7 border border-black mb-3 p-3 rounded-xl text-black">
      <div className="col-span-6 flex flex-col w-auto">
        <div className="text-2xl font-bold truncate pb-1">
          {props.rank}.&nbsp; {props.playlist.name}
        </div>
        <div className="font-thin text-sm">
          <i>
            submitted by{' '}
            <a href={spotifyProfileUrl + props.playlist.user_id}>{props.playlist.display_name}</a>
          </i>
          &nbsp;|&nbsp;
          <i>{props.playlist.likes} likes</i>
        </div>
      </div>
      <div className="col-span-1 max-w-36 my-auto pl-3">
        {props.user && (
          <button
            onClick={addLike}
            className="border border-green-700 text-green-700 bg-white hover:bg-green-500 hover:text-white py-1 w-full rounded-md"
          >
            like
          </button>
        )}
      </div>
    </div>
  );
};
