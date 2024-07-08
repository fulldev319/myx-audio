import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['songs'];
interface State extends rootState {
  songsList: any[];
  scrollPositionInSongs: number;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  songsList: [],
  scrollPositionInSongs: 0
};

// Set a SelectedSwapPool into the global state
const setSongsList = (state: State, action: Action) => {
  return {
    ...state,
    songsList: action.songsList
  };
};

const setScrollPositionInSongs = (state: State, action: Action) => {
  return {
    ...state,
    scrollPositionInSongs: action.scrollPositionInSongs
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_SONGS_LIST:
      return setSongsList(state, action);
    case actionTypes.SET_SCROLL_POSITION_IN_SONGS:
      return setScrollPositionInSongs(state, action);
    default:
      return state;
  }
};

export default reducer;
