import * as actionTypes from './ActionTypes';

export const setPodsList = (podsList: any[]) => ({
  type: actionTypes.SET_PODS_LIST,
  podsList: podsList
});

export const setScrollPositionInPods = (scrollPositionInPods: number) => ({
  type: actionTypes.SET_SCROLL_POSITION_IN_PODS,
  scrollPositionInPods: scrollPositionInPods
});

export const setReloadPods = (reload: boolean) => ({
  type: actionTypes.SET_RELOAD_PODS,
  reload: reload
});
