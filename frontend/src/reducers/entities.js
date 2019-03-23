import { RECEIVE_ENTITY } from '../actions';

const receiveEntity = (state, entity) => {
  const entitiesOfType = state[entity.type] || {};
  entitiesOfType[entity.id] = entity;
  return {
    [entity.type]: entitiesOfType,
    ...state,
  };
};

const entities = (state = {}, action) => {
  switch(action.type) {
    case RECEIVE_ENTITY:
      return receiveEntity(state, action.entity)
    default:
      return state;
  };
};

export default entities;
