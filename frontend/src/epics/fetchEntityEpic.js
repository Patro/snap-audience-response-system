import { EMPTY } from 'rxjs';
import { filter, mergeMap, map, catchError } from 'rxjs/operators';
import { FETCH_ENTITY, receiveEntity } from '../actions';

const fetchEntityEpic = (action$, _, { api }) => action$.pipe(
  filter(action => action.type === FETCH_ENTITY),
  mergeMap(({ entityType, entityId }) =>
    api.entities.fetch({ type: entityType, id: entityId }).pipe(
      map(receiveEntity),
      catchError(() => EMPTY)
    )
  )
);

export default fetchEntityEpic;
