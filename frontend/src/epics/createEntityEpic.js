import { EMPTY } from 'rxjs';
import { filter, mergeMap, map, catchError } from 'rxjs/operators';
import { CREATE_ENTITY, receiveEntity } from '../actions';

const createEntityEpic = (action$, _, { api }) => action$.pipe(
  filter(action => action.type === CREATE_ENTITY),
  mergeMap(({ entity }) =>
    api.entities.create(entity).pipe(
      map(receiveEntity),
      catchError(() => EMPTY)
    )
  )
);

export default createEntityEpic;
