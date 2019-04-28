import { combineEpics } from 'redux-observable';
import createEntityEpic from './createEntityEpic';
import destroyEntityEpic from './destroyEntityEpic';
import fetchCollectionEpic from './fetchCollectionEpic';
import fetchEntityEpic from './fetchEntityEpic';
import joinSessionEpic from './joinSessionEpic';
import respondToPollEpic from './respondToPollEpic';
import saveQuestionEpic from './saveQuestionEpic';
import startSessionEpic from './startSessionEpic';

export default combineEpics(
  createEntityEpic, destroyEntityEpic, fetchCollectionEpic, fetchEntityEpic,
  joinSessionEpic, respondToPollEpic, saveQuestionEpic, startSessionEpic
);
