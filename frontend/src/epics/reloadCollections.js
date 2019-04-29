import { pipe, merge } from 'rxjs';
import { first, filter, mergeMap, map } from 'rxjs/operators';
import get from 'lodash/get';
import { receiveCollection } from '../actions';

const reloadCollections = (state$, type, { api }) => state$.pipe(
  first(),
  getCollections(getRootType(type, api)),
  mergeMap(collections => fetchCollections$(collections, api)),
);

export default reloadCollections;

///////////////////////////////////////////////////////////////////////////////

const getCollections = (type) => (
  pipe(
    map(state => get(state, `collections.${type}`)),
    filter(collectionsHash => collectionsHash !== undefined),
    map(collectionsHash => Object.values(collectionsHash)),
  )
);

const fetchCollections$ = (collections, api) => (
  merge(
    ...collections.map(collection => fetchCollection$(collection, api))
  )
);

const fetchCollection$ = (collection, api) => (
  api.collections.fetch({
    type: collection.type,
    filterParams: collection.filterParams,
  }).pipe(
    map(receiveCollection)
  )
);

const getRootType = (type, api) => (
  get(api, `config.ROOT_TYPE_MAP.${type}`) || type
);
