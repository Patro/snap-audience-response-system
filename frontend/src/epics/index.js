import { combineEpics } from 'redux-observable';
import joinSessionEpic from './joinSessionEpic';

export default combineEpics(
  joinSessionEpic
);
