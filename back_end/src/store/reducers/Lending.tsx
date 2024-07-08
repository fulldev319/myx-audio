import * as actionTypes from '../actions/ActionTypes';
import { RootState } from './Reducer';
import { MusicData } from '../actions/MusicLending';

type MusicRootState = RootState['musicLending'];
interface MusicState extends MusicRootState {}
interface MusicAction extends MusicData {
  type: string;
}

// Music Credit State
const initialState: MusicState = new Map([]);

// Set a Lending into the global state
const setMusicLending = (state: MusicState, action: MusicAction) => {
  var musicObj: any = action;
  delete musicObj.type; // dont need type property
  state.set(musicObj.id, musicObj);
  return state;
};

// Replace Music Lendings, actions will be an array of MusicData
const setAllMusicLending = (state: MusicState, action: any) => {
  state = new Map([]);
  const lendings: MusicData[] = action.lendings;
  lendings.forEach((musicData) => {
    state.set(musicData.id, musicData);
  });
  return state;
};

// Delete a Music Lending from the state
const removeMusicLending = (state: MusicState, action: MusicAction) => {
  state.delete(action.id);
  return state;
};

// Return the SelectedLendingPage state
const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_MUSIC_LENDING:
      return setMusicLending(state, action);
    case actionTypes.SET_ALL_MUSIC_LENDING:
      return setAllMusicLending(state, action);
    case actionTypes.REMOVE_MUSIC_LENDING:
      return removeMusicLending(state, action);
    default:
      return state;
  }
};

export default reducer;
