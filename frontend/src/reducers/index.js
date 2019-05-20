import { combineReducers } from 'redux-immutable';
import collections from './collections';
import entities from './entities';
import jobs from './jobs';

export default combineReducers({
  collections,
  entities,
  jobs,
});
