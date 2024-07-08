import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['pods'];
interface State extends rootState {
  podsList: any[];
  scrollPositionInPods: number;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  podsList: [],
  scrollPositionInPods: 0,
  reload: false
};

// Set a SelectedSwapPool into the global state
const setPodsList = (state: State, action: Action) => {
  return {
    ...state,
    podsList: action.podsList
  };
};

const setReloadPod = (state: State, action: Action) => {
  return {
    ...state,
    reload: action.reload
  };
};

const setScrollPositionInPods = (state: State, action: Action) => {
  return {
    ...state,
    scrollPositionInPods: action.scrollPositionInPods
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_PODS_LIST:
      return setPodsList(state, action);
    case actionTypes.SET_RELOAD_PODS:
      return setReloadPod(state, action);
    case actionTypes.SET_SCROLL_POSITION_IN_PODS:
      return setScrollPositionInPods(state, action);
    default:
      return state;
  }
};

export default reducer;
