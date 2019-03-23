import { EMPTY } from 'rxjs';
import { filter, mergeMap, skipWhile, tap, catchError } from 'rxjs/operators';
import { JOIN_SESSION } from '../actions';
import { ATTENDANCE } from '../constants/entityTypes'

const buildSessionUrl = (attendance) => (
  `/interactive_sessions/${attendance.relationships.interactiveSession.id}`
);

const redirectToSession = (attendance, history) => (
  history.push(buildSessionUrl(attendance))
);

const joinSessionEpic = (action$, _, { api, history }) => action$.pipe(
  filter(action => action.type === JOIN_SESSION),
  mergeMap(({ attendanceCode }) =>
    api.entities.create({
      type: ATTENDANCE,
      attributes: { attendanceCode },
    }).pipe(
      tap((attendance) => redirectToSession(attendance, history)),
      skipWhile(() => true),
      catchError(() => EMPTY)
    )
  )
);

export default joinSessionEpic;
