import * as actionTypes from './ActionTypes';

export const setArtistsList = (artistsList: any[]) => ({
  type: actionTypes.SET_ARTISTS_LIST,
  artistsList: artistsList
});

export const setScrollPositionInArtists = (
  scrollPositionInArtists: number
) => ({
  type: actionTypes.SET_SCROLL_POSITION_IN_ARTISTS,
  scrollPositionInArtists: scrollPositionInArtists
});
