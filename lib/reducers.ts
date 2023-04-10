import { Playlist } from '@/const/interface';

export const renderedPlaylistsReducer = (playlists: Playlist[], action: any) => {
  switch (action.type) {
    case 'addSubmission':
      return [...playlists, ...action.playlists];
    case 'removeSubmission':
      return [...action.playlists];
    case 'updateLikes':
      return playlists.map((playlist) => {
        if (playlist.id === action.playlist.id) {
          let likedPlaylist = action.playlist;
          likedPlaylist.likes = action.likes;
          likedPlaylist.is_liked = action.isLiked;
          return likedPlaylist;
        } else {
          return playlist;
        }
      });
    default:
      return playlists;
  }
};
