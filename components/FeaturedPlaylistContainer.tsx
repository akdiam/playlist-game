import { FeaturedPlaylistContainerProps } from '@/const/interface';
import { AnimatePresence, motion } from 'framer-motion';
import { FeaturedPlaylistInfoBar } from './FeaturedPlaylistInfoBar';

export const FeaturedPlaylistContainer = (props: FeaturedPlaylistContainerProps) => {
  const iframeVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const iframeTransition = {
    duration: 0.1,
    ease: 'easeOut',
  };

  return (
    <div className="w-full md:w-2/3 pl-6 mt-6">
      <div className="sticky top-6 z-10 bg-white">
        <div className="md:relative">
          {props.featuredPlaylist && (
            <AnimatePresence mode="popLayout">
              <motion.div
                style={{ willChange: 'opacity, transform' }}
                className="md:absolute inset-0 w-full"
                key={props.featuredPlaylist.playlist_id}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={iframeVariants}
                transition={iframeTransition}
              >
                <FeaturedPlaylistInfoBar
                  playlist={props.featuredPlaylist}
                  rank={props.rank}
                  isLiked={false}
                  spotifyUser={props.spotifyUser}
                />
                <div className="md:flex md:flex-row">
                  <iframe
                    className="md:w-1/2 lg:w-2/3"
                    src={`https://open.spotify.com/embed/playlist/${props.featuredPlaylist.playlist_id}`}
                    width="100%"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                  <div className="flex flex-col justify-between md:w-1/2 lg:w-1/3 invisible md:visible border border-black rounded-md overflow-auto ml-3">
                    <div className="p-3 italic font-bold border-b border-black">comments</div>
                    <div className="px-3 text-sm text-gray-400">ahhh, the sound of silence...</div>
                    <div className="px-3 py-5 border-t border-black">
                      <form className="flex">
                        <input className="flex-grow bg-white text-sm border border-gray-400 rounded-md mr-2 p-1 focus:border-black focus:ring-black focus:outline-none"></input>
                        <button className="disabled text-sm border border-blue-600 text-blue-600 rounded-md px-3 py-1 hover:bg-blue-500 hover:text-white">
                          send
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
          {!props.featuredPlaylist && <div>no submissions yet!</div>}
        </div>
      </div>
    </div>
  );
};
