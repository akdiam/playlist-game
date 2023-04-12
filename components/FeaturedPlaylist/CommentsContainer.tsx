import Image from 'next/image';
import { useState, useEffect } from 'react';

import { Spinner } from '../Spinner';
import { Comment, CommentsContainerProps } from '@const/interface';

export const CommentsContainer = (props: CommentsContainerProps) => {
  const [areCommentsLoading, setAreCommentsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInputValue, setCommentInputValue] = useState('');
  const [canSendComment, setCanSendComment] = useState(false);

  const userUrl = 'https://open.spotify.com/user/';

  const loadComments = async () => {
    setAreCommentsLoading(true);
    try {
      const params = new URLSearchParams({
        playlistId: props.featuredPlaylist.id,
        roundId: props.featuredPlaylist.round_id,
      });

      const response = await fetch(`/api/comments?${params}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { submissionComments } = await response.json();
      setComments(submissionComments);
    } catch (error: any) {
      console.error(error);
    }
    setAreCommentsLoading(false);
  };

  const sendComment = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentInputValue,
          playlistId: props.featuredPlaylist.id,
          roundId: props.featuredPlaylist.round_id,
          userId: props.user?.id,
          displayName: props.user?.display_name,
        }),
      });

      const { sentComment } = await response.json();
      if (response.ok) {
        setComments([...comments, sentComment]);
        setCommentInputValue('');
        setCanSendComment(false);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleInputChange = (event: any) => {
    if (event.target.value.length > 0) {
      setCanSendComment(true);
    } else {
      setCanSendComment(false);
    }
    setCommentInputValue(event.target.value);
  };

  useEffect(() => {
    loadComments();
  }, [props.featuredPlaylist.id]);

  return (
    <div className="hidden md:flex h-[25vh] md:h-[65vh] flex flex-col justify-between md:w-1/2 lg:w-1/3 border border-black rounded-xl mr-3">
      <div className="p-3 italic font-bold border-b border-black shadow-sm">comments</div>
      {areCommentsLoading && (
        <div className="mx-auto">
          <Spinner />
        </div>
      )}
      {!areCommentsLoading && (
        <>
          {comments.length === 0 && (
            <div className="px-3 text-sm text-gray-400">ahhh, the sound of silence...</div>
          )}
          {comments.length > 0 && (
            <div className="overflowContainer p-3 flex-grow overflow-auto">
              {comments.map((comment: Comment, _) => (
                <>
                  <a href={userUrl + comment.user_id} className="pb-1 text-sm font-bold">
                    {comment.display_name}
                  </a>
                  <div className="pb-2 text-sm break-all">{comment.content}</div>
                </>
              ))}
            </div>
          )}
        </>
      )}
      <div className="px-3 py-5 border-t border-black">
        {props.user && (
          <form onSubmit={sendComment} className="flex">
            <input
              onChange={handleInputChange}
              value={commentInputValue}
              className="flex-grow bg-white text-sm border border-gray-400 rounded-md p-1 focus:border-black focus:ring-black focus:outline-none"
            ></input>
            <button disabled={!canSendComment} className="rounded-md pl-3 hover:text-white">
              <Image
                src={canSendComment ? 'send_active.svg' : 'send_inactive.svg'}
                alt="send comment"
                height={30}
                width={30}
              />
            </button>
          </form>
        )}
        {!props.user && <div className="text-sm text-gray-400">please log in to comment.</div>}
      </div>
    </div>
  );
};
