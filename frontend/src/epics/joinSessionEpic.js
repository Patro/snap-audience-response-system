import { EMPTY } from 'rxjs';
import { filter, mergeMap, skipWhile, catchError } from 'rxjs/operators';
import { JOIN_SESSION } from '../actions';

const joinSessionEpic = (action$, _, { api }) => action$.pipe(
  filter(action => action.type === JOIN_SESSION),
  mergeMap(({ attendanceCode }) =>
    api.entities.create({
      type: 'ATTENDANCE',
      attributes: { attendanceCode },
    }).pipe(
      skipWhile(() => true),
      catchError(() => EMPTY)
    )
  )
);

export default joinSessionEpic;
