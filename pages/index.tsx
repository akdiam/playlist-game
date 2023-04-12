import Head from 'next/head';
import { NextPage } from 'next';
import { useReducer, useState } from 'react';
import { getSession } from 'next-auth/react';

import { getPlaylists, getSubmittedPlaylist } from '../util/dbUtil';
import { Playlist, User } from '@const/interface';
import { renderedPlaylistsReducer } from '@lib/reducers';
import { SubmissionList } from '@components/SubmissionList/SubmissionList';
import { FeaturedPlaylistContainer } from '@components/FeaturedPlaylist/FeaturedPlaylistContainer';
import { ActionBox } from '@components/ActionBox/ActionBox';
import { Session } from 'next-auth';

const Home: NextPage<{
  playlists: Playlist[];
  user: User | null;
  submittedPlaylist: Playlist | null;
}> = ({ playlists, user, submittedPlaylist }) => {
  const [featuredPlaylist, setFeaturedPlaylist] = useState(playlists[0] ?? null);
  const [featuredPlaylistRank, setFeaturedPlaylistRank] = useState(1);
  const [renderedPlaylists, dispatch] = useReducer<(arg1: Playlist[], actions: any) => Playlist[]>(
    renderedPlaylistsReducer,
    playlists
  );

  const handleClick = (playlist: Playlist, rank: number) => {
    playlist.spotify_id && setFeaturedPlaylist(playlist);
    setFeaturedPlaylistRank(rank);
  };

  return (
    <>
      <Head>
        <title>playlist forum</title>
        <meta name="description" content="the playlist forum" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-90 mx-auto md:p-6">
        <div className="p-3 md:p-0 border-b-2 border-gray-700">
          <h1 className="text-4xl mb-6 font-semibold">
            <span>welcome to </span>
            <span className="before:block before:absolute before:-inset-1 before:-skew-y-2 before:bg-[#FF7F50] relative inline-block">
              <u className="relative text-white">playlist forum</u>
            </span>
            {user !== null && <span>, {user.display_name}!</span>}
          </h1>
          <div className="text-2xl">today&apos;s playlist aura: </div>
          <h2 id="aura" className="text-3xl md:text-4xl lg:text-7xl font-bold mb-6">
            LUDICROUSLY CAPACIOUS
          </h2>
          <ActionBox user={user} submittedPlaylist={submittedPlaylist} />
        </div>
        <div className="flex flex-col md:flex-row md:min-h-screen border-b-2 border-black sticky-container h-[100dvh] md:h-auto overflow-hidden md:overflow-visible">
          <FeaturedPlaylistContainer
            featuredPlaylist={featuredPlaylist}
            rank={featuredPlaylistRank}
            user={user}
            dispatch={dispatch}
            setFeaturedPlaylist={setFeaturedPlaylist}
          />
          <SubmissionList
            renderedPlaylists={renderedPlaylists}
            featuredPlaylist={featuredPlaylist}
            handleClick={handleClick}
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

  if (session && session.user?.name && session.user?.id) {
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

  const playlists = await getPlaylists(0, roundId, user?.id ?? '');

  return {
    props: {
      playlists,
      user,
      submittedPlaylist,
    },
  };
}

export default Home;
