import { combineEpics } from 'redux-observable';
import fetchCollectionEpic from './fetchCollectionEpic';
import fetchEntityEpic from './fetchEntityEpic';
import joinSessionEpic from './joinSessionEpic';

export default combineEpics(
  fetchCollectionEpic, fetchEntityEpic, joinSessionEpic
);
