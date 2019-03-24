import { combineReducers } from 'redux';
import collections from './collections';
import entities from './entities';

export default combineReducers({
  collections,
  entities,
});
