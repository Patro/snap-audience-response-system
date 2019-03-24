import pick from 'lodash/pick';
import { RECEIVE_COLLECTION } from '../actions';

const mapEntityToIdentifier = (entity) => (
  pick(entity, ['id', 'type'])
);

const mapCollection = (collection) => ({
  entities: collection.entities.map(mapEntityToIdentifier)
});

const receiveCollection = (state, entityType, filterParams, collection) => {
  const collectionsOfType = state[entityType] || {};
  const collectionKey = JSON.stringify(filterParams);
  collectionsOfType[collectionKey] = mapCollection(collection);
  return {
    [entityType]: collectionsOfType,
    ...state,
  };
};

const entities = (state = {}, action) => {
  switch(action.type) {
    case RECEIVE_COLLECTION:
      return receiveCollection(
        state, action.entityType, action.filterParams, action.collection
      )
    default:
      return state;
  };
};

export default entities;
