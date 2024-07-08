import * as actionTypes from './ActionTypes';

export const setCollectionsList = (collectionsList: any[]) => ({
  type: actionTypes.SET_COLLECTIONS_LIST,
  collectionsList: collectionsList
});

export const setScrollPositionInCollections = (
  scrollPositionInCollections: number
) => ({
  type: actionTypes.SET_SCROLL_POSITION_IN_COLLECTIONS,
  scrollPositionInCollections: scrollPositionInCollections
});
