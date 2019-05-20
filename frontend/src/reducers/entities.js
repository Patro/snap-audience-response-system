import Immutable from 'immutable';
import { RECEIVE_COLLECTION, RECEIVE_ENTITY } from '../actions';

const entities = (state = Immutable.fromJS({}), action) => {
  switch(action.type) {
    case RECEIVE_COLLECTION:
      return receiveCollection(state, action.collection)
    case RECEIVE_ENTITY:
      return receiveEntity(state, action.entity)
    default:
      return state;
  };
};

export default entities;

///////////////////////////////////////////////////////////////////////////////

const receiveCollection = (state, collection) => (
  collection.get('entities').reduce(receiveEntity, state)
);

const receiveEntity = (state, entity) => (
  state.setIn([entity.get('type'), entity.get('id')], entity)
);
