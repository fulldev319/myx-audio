import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['musics'];
interface State extends rootState {
  musicsList: any[];
  scrollPositionInMusics: number;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  musicsList: [],
  scrollPositionInMusics: 0
};

// Set a SelectedSwapPool into the global state
const setMusicsList = (state: State, action: Action) => {
  return {
    ...state,
    musicsList: action.musicsList
  };
};

const setScrollPositionInMusics = (state: State, action: Action) => {
  return {
    ...state,
    scrollPositionInMusics: action.scrollPositionInMusics
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_MUSICS_LIST:
      return setMusicsList(state, action);
    case actionTypes.SET_SCROLL_POSITION_IN_MUSICS:
      return setScrollPositionInMusics(state, action);
    default:
      return state;
  }
};

export default reducer;
