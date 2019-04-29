import pick from 'lodash/pick';
import { RECEIVE_COLLECTION } from '../actions';

const entities = (state = {}, action) => {
  switch(action.type) {
    case RECEIVE_COLLECTION:
      return receiveCollection(state, action.collection)
    default:
      return state;
  };
};

export default entities;

///////////////////////////////////////////////////////////////////////////////

const receiveCollection = (state, collection) => {
  const collectionsOfType = state[collection.type] || {};
  const collectionKey = JSON.stringify(collection.filterParams);
  collectionsOfType[collectionKey] = mapCollection(collection);
  return {
    [collection.type]: collectionsOfType,
    ...state,
  };
};

const mapCollection = (collection) => ({
  type: collection.type,
  filterParams: collection.filterParams,
  entities: collection.entities.map(mapEntityToIdentifier),
});

const mapEntityToIdentifier = (entity) => (
  pick(entity, ['id', 'type'])
);
