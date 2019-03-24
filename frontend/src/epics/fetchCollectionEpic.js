import { EMPTY } from 'rxjs';
import { filter, mergeMap, map, catchError } from 'rxjs/operators';
import { FETCH_COLLECTION, receiveCollection } from '../actions';

const fetchCollectionEpic = (action$, _, { api }) => action$.pipe(
  filter(action => action.type === FETCH_COLLECTION),
  mergeMap(({ entityType, filterParams }) =>
    api.entities.fetchCollection({ type: entityType, filterParams }).pipe(
      map(collection =>
        receiveCollection(entityType, filterParams, collection)
      ),
      catchError(() => EMPTY)
    )
  )
);

export default fetchCollectionEpic;
