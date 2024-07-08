import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';

type rootState = RootState['collections'];
interface State extends rootState {
  collectionsList: any[];
  scrollPositionInCollections: number;
}
interface Action extends rootState {
  type: string;
}

// Set initial state for SelectedSwapTabsValue
const initialState: State = {
  collectionsList: [],
  scrollPositionInCollections: 0
};

// Set a SelectedSwapPool into the global state
const setCollectionsList = (state: State, action: Action) => {
  return {
    ...state,
    collectionsList: action.collectionsList
  };
};

const setScrollPositionInCollections = (state: State, action: Action) => {
  return {
    ...state,
    scrollPositionInCollections: action.scrollPositionInCollections
  };
};

// Return the SelectedSwapPool state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_COLLECTIONS_LIST:
      return setCollectionsList(state, action);
    case actionTypes.SET_SCROLL_POSITION_IN_COLLECTIONS:
      return setScrollPositionInCollections(state, action);
    default:
      return state;
  }
};

export default reducer;
