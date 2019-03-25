import { combineEpics } from 'redux-observable';
import createEntityEpic from './createEntityEpic';
import fetchCollectionEpic from './fetchCollectionEpic';
import fetchEntityEpic from './fetchEntityEpic';
import joinSessionEpic from './joinSessionEpic';

export default combineEpics(
  createEntityEpic, fetchCollectionEpic, fetchEntityEpic, joinSessionEpic
);
