import Head from 'next/head';
import { NextPage } from 'next';
import { useReducer, useState } from 'react';
import cookie from 'cookie';

import { getUserData } from '../util/spotify';
import { getPlaylists } from '../util/dbUtil';
import { Playlist } from '@/const/interface';
import { renderedPlaylistsReducer } from '@/lib/reducers';
import { SubmissionList } from '@/components/SubmissionList';
import { FeaturedPlaylistContainer } from '@/components/FeaturedPlaylistContainer';
import { ActionBox } from '@/components/ActionBox';

const Home: NextPage<{ playlists: Playlist[], spotifyUser: Record<string, string> | null }> = ({ playlists, spotifyUser }) => {
  const [featuredPlaylist, setFeaturedPlaylist] = useState(playlists[0] ?? null);
  const [featuredPlaylistRank, setFeaturedPlaylistRank] = useState(1);
  const [renderedPlaylists, dispatchRenderedPlaylists] = useReducer<(arg1: Playlist[], actions: any) => Playlist[]>(renderedPlaylistsReducer, playlists);


  const handleClick = (playlist: Playlist, rank: number) => {
    playlist.playlist_id && setFeaturedPlaylist(playlist);
    setFeaturedPlaylistRank(rank);
  };

  const refreshList = async () => {
    // const top100 = await getPlaylists(0, 'hi');
    // dispatchRenderedPlaylists({ type: 'add', playlists: top100 });
  };

  return (
    <>
      <Head>
        <title>the playlist game</title>
        <meta name="description" content="the playlist game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='max-w-7xl mx-auto p-6'>
        <div className='pb-14 border-b-2 border-gray-700'>
          <h1 className='text-4xl mb-6 font-semibold'>
            <span>welcome to </span><u>the playlist game</u>
            {spotifyUser !== null && (<span>, {spotifyUser.display_name}!</span>)}
          </h1>
          <div className='text-2xl'>today&apos;s playlist aura: </div>
          <h2 id='aura' className='text-3xl md:text-4xl lg:text-7xl font-bold text-red-400 mb-6'>LUDICROUSLY CAPACIOUS</h2>
          <ActionBox spotifyUser={spotifyUser} />
        </div>
        <div className='md:flex'>
          <SubmissionList renderedPlaylists={renderedPlaylists} featuredPlaylist={featuredPlaylist} handleClick={handleClick} />
          <FeaturedPlaylistContainer featuredPlaylist={featuredPlaylist} rank={featuredPlaylistRank} />
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context: Record<string, any>) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  const accessToken = cookies.access_token;
  const spotifyUser = await getUserData(accessToken).catch((error) => {
    return null;
  });
  const playlists = await getPlaylists(0, 'hi');

  return {
    props: {
      playlists,
      spotifyUser,
    }
  }
}

export default Home;