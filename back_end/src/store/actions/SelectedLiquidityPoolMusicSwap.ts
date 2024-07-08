import * as actionTypes from './ActionTypes';

// Set a SelectedLiquidityPoolMusicSwap.ts into the global state
export const setSelectedLiquidityPoolMusicSwap = (value: string) => ({
  type: actionTypes.SET_SELECTED_LIQUIDITY_POOL_MUSIC_SWAP,
  value: value
});
