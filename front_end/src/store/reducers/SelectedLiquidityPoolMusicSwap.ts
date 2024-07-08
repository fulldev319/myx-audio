import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedLiquidityPoolMusicSwap'];
interface State extends rootState {}
interface Action extends rootState {
  type: string;
  value: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState = {
  value: ''
};

// Set a SelectedSwapPool into the global state
const setSelectedLiquidityPoolMusicSwap = (state: State, action: Action) => {
  return {
    ...state,
    ...{ value: action.value }
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_SELECTED_LIQUIDITY_POOL_MUSIC_SWAP:
      return setSelectedLiquidityPoolMusicSwap(state, action);
    default:
      return state;
  }
};

export default reducer;
