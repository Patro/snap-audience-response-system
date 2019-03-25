import { merge, of } from 'rxjs';
import { filter, map, mergeMap, tap, catchError, endWith } from 'rxjs/operators';
import {
  JOIN_SESSION, markJobAsStarted, markJobAsSucceeded, markJobAsFailed, removeJob
} from '../actions';
import { ATTENDANCE } from '../constants/entityTypes'

const buildSessionUrl = (attendance) => (
  `/interactive_sessions/${attendance.relationships.interactiveSession.id}`
);

const redirectToSession = (attendance, history) => (
  history.push(buildSessionUrl(attendance))
);

const createAttendance$ = ({ attendanceCode, jobId }, { api, history }) => (
  api.entities.create({
    type: ATTENDANCE,
    attributes: { attendanceCode },
  }).pipe(
    tap(attendance => redirectToSession(attendance, history)),
    map(attendance => markJobAsSucceeded(jobId, attendance)),
    catchError((err) => {
      if (err.response === undefined) { throw err; }
      return of(markJobAsFailed(jobId, err.response.errors));
    }),
    endWith(removeJob(jobId)),
  )
);

const joinSessionEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === JOIN_SESSION),
  mergeMap(action =>
    merge(
      of(markJobAsStarted(action.jobId)),
      createAttendance$(action, dependencies)
    )
  )
);

export default joinSessionEpic;
