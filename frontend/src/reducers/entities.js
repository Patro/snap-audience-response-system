import { RECEIVE_COLLECTION, RECEIVE_ENTITY } from '../actions';

const entities = (state = {}, action) => {
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
  collection.entities.reduce(receiveEntity, state)
);

const receiveEntity = (state, entity) => {
  const entitiesOfType = state[entity.type] || {};
  entitiesOfType[entity.id] = entity;
  return {
    [entity.type]: entitiesOfType,
    ...state,
  };
};
