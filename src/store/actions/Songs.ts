import * as actionTypes from './ActionTypes';

export const setSongsList = (songsList: any[]) => ({
  type: actionTypes.SET_SONGS_LIST,
  songsList: songsList
});

export const setScrollPositionInSongs = (scrollPositionInSongs: number) => ({
  type: actionTypes.SET_SCROLL_POSITION_IN_SONGS,
  scrollPositionInSongs: scrollPositionInSongs
});
