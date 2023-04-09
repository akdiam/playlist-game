export interface User {
  id: string;
  display_name: string;
}

export interface Playlist {
  id: string;
  spotify_id: string;
  user_id: string;
  display_name: string;
  name: string;
  submission_date: string;
  submission_time: string;
  round_id: string;
  likes: string;
  cover_image_src: string;
  is_liked?: boolean;
}

export interface PlaylistEntryProps {
  playlist: Playlist;
  rank: number;
  isLiked: boolean;
}

export interface SubmissionListProps {
  renderedPlaylists: Playlist[];
  featuredPlaylist: Playlist;
  handleClick: Function;
}

export interface FeaturedPlaylistContainerProps {
  featuredPlaylist: Playlist;
  rank: number;
  user: User | null;
}

export interface FeaturedPlaylistInfoBarProps {
  playlist: Playlist;
  rank: number;
  isLiked: boolean;
  user: User | null;
}

export interface ActionBoxProps {
  user: User | null;
  submittedPlaylist: Playlist | null;
}

export interface submittedPlaylistContainerProps {
  submittedPlaylist: Playlist;
  setSubmittedPlaylist: Function;
  handleSync: Function;
}

export interface Comment {
  id: string;
  playlist_id: string;
  round_id: string;
  user_id: string;
  time_submitted: string;
  content: string;
  display_name: string;
}

export interface CommentsContainerProps {
  featuredPlaylist: Playlist;
  user: User | null;
}
