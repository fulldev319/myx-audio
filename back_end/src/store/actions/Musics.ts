import * as actionTypes from './ActionTypes';

export const setMusicsList = (musicsList: any[]) => ({
  type: actionTypes.SET_MUSICS_LIST,
  musicsList: musicsList
});

export const setScrollPositionInMusics = (scrollPositionInMusics: number) => ({
  type: actionTypes.SET_SCROLL_POSITION_IN_MUSICS,
  scrollPositionInMusics: scrollPositionInMusics
});
