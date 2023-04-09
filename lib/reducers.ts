import { Playlist } from '@/const/interface';

export const renderedPlaylistsReducer = (playlists: Playlist[], action: any) => {
  switch (action.type) {
    case 'addSubmission':
      return [...playlists, ...action.playlists];
    case 'removeSubmission':
      return [...action.playlists];
    case 'addLike':
      return playlists.map((playlist) => {
        if (playlist.id === action.playlist.id) {
          let likedPlaylist = action.playlist;
          likedPlaylist.likes = `${+likedPlaylist.likes + 1}`;
          return likedPlaylist;
        } else {
          return playlist;
        }
      });
    case 'removeLike':
      return playlists.map((playlist) => {
        if (playlist.id === action.playlist.id) {
          let likedPlaylist = action.playlist;
          likedPlaylist.likes = `${+likedPlaylist.likes - 1}`;
          return likedPlaylist;
        } else {
          return playlist;
        }
      });
    default:
      return playlists;
  }
};
