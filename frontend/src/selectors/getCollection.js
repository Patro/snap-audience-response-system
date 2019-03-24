import get from 'lodash/get';

const getCollection = (state, type, filterParams = {}) => {
  const collectionsOfType = get(state, `collections.${type}`);
  if (collectionsOfType === undefined) { return; }

  const filterKey = JSON.stringify(filterParams);
  return collectionsOfType[filterKey];
};

export default getCollection;
