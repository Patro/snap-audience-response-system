import Immutable from 'immutable';
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
    map(state => state.getIn(['collections', type])),
    filter(collectionsMap => collectionsMap !== undefined),
    map(collectionsMap => collectionsMap.valueSeq()),
  )
);

const fetchCollections$ = (collections, api) => (
  merge(
    ...collections.map(collection => fetchCollection$(collection, api))
  )
);

const fetchCollection$ = (collection, api) => (
  api.collections.fetch(Immutable.Map({
    type: collection.get('type'),
    filterParams: collection.get('filterParams'),
  })).pipe(
    map(receiveCollection)
  )
);

const getRootType = (type, api) => (
  get(api, `config.ROOT_TYPE_MAP.${type}`) || type
);
