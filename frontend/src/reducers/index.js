import { combineReducers } from 'redux';
import collections from './collections';
import entities from './entities';
import jobs from './jobs';

export default combineReducers({
  collections,
  entities,
  jobs,
});
