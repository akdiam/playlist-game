export interface Playlist {
  id: string;
  playlist_id: string;
  user_id: string;
  display_name: string;
  name: string;
  submission_date: string;
  submission_time: string;
  round_id: string;
  votes: string;
  cover_image_src: string;
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
}

export interface ActionBoxProps {
  spotifyUser: Record<string, string> | null;
  submittedPlaylist: Playlist | null;
}

export interface submittedPlaylistContainerProps {
  submittedPlaylist: Playlist;
  setSubmittedPlaylist: Function;
  handleSync: Function;
}
