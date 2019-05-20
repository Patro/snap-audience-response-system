import getCollection from './getCollection';
import getEntity from './getEntity';

const getEntitiesOfCollection = (state, type, filterParams = {}) => {
  const collection = getCollection(state, type, filterParams);
  if (collection === undefined) { return; }

  return collection.get('entities').map(identifier =>
    getEntity(state, identifier)
  ).filter(entitiy => entitiy !== undefined)
};

export default getEntitiesOfCollection;
