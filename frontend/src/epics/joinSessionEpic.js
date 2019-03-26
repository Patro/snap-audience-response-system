import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { JOIN_SESSION, receiveEntity } from '../actions';
import { ATTENDANCE } from '../constants/entityTypes'
import withJob from './withJob';

const joinSessionEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === JOIN_SESSION),
  mergeMap(action => processAction(action, dependencies))
);

export default joinSessionEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction = (action, dependencies) => (
  withJob(
    action.jobId,
    createAttendance$(action, dependencies),
    map(receiveEntity)
  )
);

const createAttendance$ = ({ attendanceCode }, { api, history }) => (
  api.entities.create({
    type: ATTENDANCE,
    attributes: { attendanceCode },
  }).pipe(
    tap(attendance => redirectToSession(attendance, history))
  )
);

const redirectToSession = (attendance, history) => (
  history.push(buildSessionUrl(attendance))
);

const buildSessionUrl = (attendance) => (
  `/interactive_sessions/${attendance.relationships.interactiveSession.id}`
);
