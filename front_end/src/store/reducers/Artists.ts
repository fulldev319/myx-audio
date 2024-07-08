import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['artists'];
interface State extends rootState {
  artistsList: any[];
  scrollPositionInArtists: number;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  artistsList: [],
  scrollPositionInArtists: 0
};

// Set a SelectedSwapPool into the global state
const setArtistsList = (state: State, action: Action) => {
  return {
    ...state,
    artistsList: action.artistsList
  };
};

const setScrollPositionInArtists = (state: State, action: Action) => {
  return {
    ...state,
    scrollPositionInArtists: action.scrollPositionInArtists
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_ARTISTS_LIST:
      return setArtistsList(state, action);
    case actionTypes.SET_SCROLL_POSITION_IN_ARTISTS:
      return setScrollPositionInArtists(state, action);
    default:
      return state;
  }
};

export default reducer;
