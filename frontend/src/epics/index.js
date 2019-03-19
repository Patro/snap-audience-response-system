import { combineEpics } from 'redux-observable';
import fetchEntityEpic from './fetchEntityEpic';
import joinSessionEpic from './joinSessionEpic';

export default combineEpics(
  fetchEntityEpic, joinSessionEpic
);
