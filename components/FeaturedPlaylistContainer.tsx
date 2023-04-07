import { FeaturedPlaylistContainerProps } from '@/const/interface';
import { AnimatePresence, motion } from 'framer-motion';
import { FeaturedPlaylistInfoBar } from './FeaturedPlaylistInfoBar';
import { useEffect, useState } from 'react';
import { Spinner } from './Spinner';
import { CommentsContainer } from './CommentsContainer';

export const FeaturedPlaylistContainer = (props: FeaturedPlaylistContainerProps) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [hasComponentMounted, setHasComponentMounted] = useState(false);

  const iframeVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const iframeTransition = {
    duration: 0.1,
    ease: 'easeOut',
  };

  useEffect(() => {
    setIsIframeLoading(true);
  }, [props.featuredPlaylist?.id]);

  // dumb as hell hack to make iframe animation work on safari page load
  useEffect(() => {
    setHasComponentMounted(true);
  }, []);

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
                  {isIframeLoading && (
                    <div
                      className={`${
                        isIframeLoading ? 'spinner-loading' : ''
                      } fixed md:w-1/2 lg:w-2/3`}
                    >
                      <div className="centerSpinner">
                        <Spinner />
                      </div>
                    </div>
                  )}
                  {hasComponentMounted && (
                    <iframe
                      className={`${
                        isIframeLoading ? 'iframe-loading' : 'iframe-visible'
                      } md:w-1/2 lg:w-2/3`}
                      src={`https://open.spotify.com/embed/playlist/${props.featuredPlaylist.playlist_id}`}
                      width="100%"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      onLoad={() => {
                        setIsIframeLoading(false);
                      }}
                    />
                  )}
                  {!hasComponentMounted && (
                    <div className="md:w-1/2 lg:w-2/3 placeholder iframe-loading"></div>
                  )}
                  <CommentsContainer
                    featuredPlaylist={props.featuredPlaylist}
                    spotifyUser={props.spotifyUser}
                  />
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
