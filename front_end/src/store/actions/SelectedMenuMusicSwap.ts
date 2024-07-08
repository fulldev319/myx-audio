import * as actionTypes from './ActionTypes';

// Set a SelectedProfilePage.ts into the global state
export const setSelectedMenuMusicSwap = (id: number) => ({
  type: actionTypes.SET_SELECTED_MENU_MUSIC_SWAP,
  id: id
});
