import { FeaturedPlaylistContainerProps } from '@/const/interface';
import { AnimatePresence, motion } from 'framer-motion'; 
import { FeaturedPlaylistInfoBar } from './FeaturedPlaylistInfoBar';

export const FeaturedPlaylistContainer = (props: FeaturedPlaylistContainerProps) => {
  const iframeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const iframeTransition = {
    duration: 0.2,
    ease: 'easeOut',
  };

  return (
    <div className='w-full md:w-1/2 pl-6 mt-6'>
      <div className='sticky top-6 z-10 bg-white'>
        <div className='md:relative'>
          <AnimatePresence mode='popLayout'>
            <motion.div 
              className='md:absolute inset-0 w-full'
              key={props.featuredPlaylist.playlist_id}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={iframeVariants}
              transition={iframeTransition}
            >
              <FeaturedPlaylistInfoBar playlist={props.featuredPlaylist} rank={props.rank} isLiked={false} />
              <iframe 
                src={`https://open.spotify.com/embed/playlist/${props.featuredPlaylist.playlist_id}`}
                width="100%"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
};