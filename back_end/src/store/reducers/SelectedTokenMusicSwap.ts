import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedTokenMusicSwap'];
interface State extends rootState {}
interface Action extends rootState {
  type: string;
  value: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState = {
  value: ''
};

// Set a SelectedTokenMusicSwap into the global state
const setSelectedTokenMusicSwap = (state: State, action: Action) => {
  return {
    ...state,
    ...{ value: action.value }
  };
};

// Return the SelectedTokenMusicSwap state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_SELECTED_TOKEN_MUSIC_SWAP:
      return setSelectedTokenMusicSwap(state, action);
    default:
      return state;
  }
};

export default reducer;
