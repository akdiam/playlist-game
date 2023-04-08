import Head from 'next/head';
import { NextPage } from 'next';
import { useReducer, useState } from 'react';
import { getSession } from 'next-auth/react';

import { getPlaylists, getSubmittedPlaylist } from '../util/dbUtil';
import { Playlist, User } from '@/const/interface';
import { renderedPlaylistsReducer } from '@/lib/reducers';
import { SubmissionList } from '@/components/SubmissionList/SubmissionList';
import { FeaturedPlaylistContainer } from '@/components/FeaturedPlaylist/FeaturedPlaylistContainer';
import { ActionBox } from '@/components/ActionBox/ActionBox';
import { Session } from 'next-auth';

const Home: NextPage<{
  playlists: Playlist[];
  user: User | null;
  submittedPlaylist: Playlist | null;
}> = ({ playlists, user, submittedPlaylist }) => {
  const [featuredPlaylist, setFeaturedPlaylist] = useState(playlists[0] ?? null);
  const [featuredPlaylistRank, setFeaturedPlaylistRank] = useState(1);

  const [renderedPlaylists, dispatchRenderedPlaylists] = useReducer<
    (arg1: Playlist[], actions: any) => Playlist[]
  >(renderedPlaylistsReducer, playlists);

  const handleClick = (playlist: Playlist, rank: number) => {
    playlist.playlist_id && setFeaturedPlaylist(playlist);
    setFeaturedPlaylistRank(rank);
  };

  return (
    <>
      <Head>
        <title>the playlist game</title>
        <meta name="description" content="the playlist forum" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-90 mx-auto p-3 md:p-6">
        <div className="pb-14 border-b-2 border-gray-700">
          <h1 className="text-4xl mb-6 font-semibold">
            <span>welcome to </span>
            <u>the playlist forum</u>
            {user !== null && <span>, {user.display_name}!</span>}
          </h1>
          <div className="text-2xl">today&apos;s playlist aura: </div>
          <h2 id="aura" className="text-3xl md:text-4xl lg:text-7xl font-bold text-red-400 mb-6">
            LUDICROUSLY CAPACIOUS
          </h2>
          <ActionBox spotifyUser={user} submittedPlaylist={submittedPlaylist} />
        </div>
        <div className="md:flex md:min-h-screen border-b-2 border-black">
          <SubmissionList
            renderedPlaylists={renderedPlaylists}
            featuredPlaylist={featuredPlaylist}
            handleClick={handleClick}
          />
          <FeaturedPlaylistContainer
            featuredPlaylist={featuredPlaylist}
            rank={featuredPlaylistRank}
            spotifyUser={user}
          />
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context: Record<string, any>) {
  const roundId = 'hi';
  const session: Session | null = await getSession(context);

  let submittedPlaylist: Playlist | null = null;
  let user: User | null = null;

  if (session && session.user?.name) {
    user = {
      id: session.user.id,
      display_name: session.user.name,
    };

    if (session) {
      const submittedPlaylists = await getSubmittedPlaylist(user.id, roundId);
      if (submittedPlaylists && submittedPlaylists.length > 0) {
        submittedPlaylist = submittedPlaylists[0];
      }
    }
  }

  const playlists = await getPlaylists(0, roundId);

  return {
    props: {
      playlists,
      user,
      submittedPlaylist,
    },
  };
}

export default Home;
