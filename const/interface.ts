export interface Playlist {
  id: string,
  playlist_id: string,
  user_id: string,
  display_name: string,
  name: string,
  submission_date: Date,
  submission_time: Date,
  round_id: string,
  votes: string,
};

export interface PlaylistEntryProps {
  playlist: Playlist,
  rank: number,
  isLiked: boolean,
}