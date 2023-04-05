export const renderedPlaylistsReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return [...state, ...action.playlists];
    case 'replace':
      return [...action.playlists]
    default:
      return state;
  }
}