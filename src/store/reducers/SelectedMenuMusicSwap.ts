import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['selectedMenuMusicSwap'];
interface State extends rootState {}
interface Action extends rootState {
  type: string;
  id: number;
}

// Set initial state for selectedMenuMusicSwap
const initialState = {
  id: 1
};

// Set a setSelectedMenuMusicSwap into the global state
const setSelectedMenuMusicSwap = (state: State, action: Action) => {
  return {
    ...state,
    ...{ id: action.id }
  };
};

// Return the SelectedProfilePage state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_SELECTED_MENU_MUSIC_SWAP:
      return setSelectedMenuMusicSwap(state, action);
    default:
      return state;
  }
};

export default reducer;
