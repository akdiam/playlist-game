import { FeaturedPlaylistContainerProps } from '@const/interface';
import { FeaturedPlaylistInfoBar } from './FeaturedPlaylistInfoBar';
import { useEffect, useState, useRef, RefObject } from 'react';
import { Spinner } from '../Spinner';
import { CommentsContainer } from './CommentsContainer';

export const FeaturedPlaylistContainer = (props: FeaturedPlaylistContainerProps) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [hasComponentMounted, setHasComponentMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const stickyContainerRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    setIsIframeLoading(true);
  }, [props.featuredPlaylist?.id]);

  // dumb as hell hack to make iframe animation work on safari page load
  useEffect(() => {
    setHasComponentMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (stickyContainerRef.current) {
      const topOffset = Math.max(0, 6 - scrollY);
      stickyContainerRef.current.style.top = `${topOffset}px`;
    }
  }, [scrollY]);

  return (
    <div className="w-full md:w-2/3 md:pr-6 mt-0 md:mt-6 pb-3 md:pb-0 border-b-2 md:border-b-0 border-black">
      <div ref={stickyContainerRef} className={`sticky top-0 md:top-6 z-10 bg-white`}>
        <div className="md:relative">
          {props.featuredPlaylist && (
            <div
              style={{ willChange: 'opacity, transform' }}
              className="md:absolute inset-0 w-full"
            >
              <FeaturedPlaylistInfoBar
                playlist={props.featuredPlaylist}
                rank={props.rank}
                user={props.user}
                dispatch={props.dispatch}
                setFeaturedPlaylist={props.setFeaturedPlaylist}
              />
              <div className="md:flex md:flex-row">
                <CommentsContainer featuredPlaylist={props.featuredPlaylist} user={props.user} />
                <div className="relative md:w-1/2 lg:w-2/3 h-[152px] md:h-[65vh]">
                  {isIframeLoading && (
                    <div
                      className={`${
                        isIframeLoading ? 'spinner-loading' : ''
                      } absolute inset-0 flex justify-center items-center h-[152px] md:h-[65vh] border border-gray-400 rounded-xl mx-3 md:mx-0 bg-gray-50`}
                    >
                      <Spinner />
                    </div>
                  )}
                  {hasComponentMounted && (
                    <iframe
                      className={`${
                        isIframeLoading ? 'iframe-loading' : 'iframe-visible'
                      } px-3 md:px-0 w-full h-[152px] md:h-[65vh]`}
                      src={`https://open.spotify.com/embed/playlist/${props.featuredPlaylist.spotify_id}`}
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
                </div>
              </div>
            </div>
          )}
          {!props.featuredPlaylist && <div>no submissions yet!</div>}
        </div>
      </div>
    </div>
  );
};
