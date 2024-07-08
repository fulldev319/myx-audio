import * as actionTypes from './ActionTypes';

// Set a SelectedLiquidityPoolMusicSwap.ts into the global state
export const setSelectedTokenMusicSwap = (value: string) => ({
  type: actionTypes.SET_SELECTED_TOKEN_MUSIC_SWAP,
  value: value
});
