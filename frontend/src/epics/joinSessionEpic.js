import { of, concat } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { JOIN_SESSION, receiveEntity } from '../actions';
import { ATTENDANCE, INTERACTIVE_SESSION } from '../constants/entityTypes'
import reloadCollections from './reloadCollections';
import withJob from './withJob';

const joinSessionEpic = (action$, state$, dependencies) => action$.pipe(
  filter(action => action.type === JOIN_SESSION),
  mergeMap(action => processAction$(action, state$, dependencies))
);

export default joinSessionEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction$ = (action, state$, dependencies) => (
  withJob(
    action,
    createAttendance$(action, dependencies),
    onSuccess(state$, dependencies)
  )
);

const createAttendance$ = ({ attendanceCode }, { api }) => (
  api.entities.create({
    type: ATTENDANCE,
    attributes: { attendanceCode },
  })
);

const onSuccess = (state$, dependencies) => (
  mergeMap(entity =>
    concat(
      of(receiveEntity(entity)),
      reloadCollections(state$, INTERACTIVE_SESSION, dependencies),
      of(entity).pipe(
        tap(attendance => redirectToSession(attendance, dependencies.history))
      )
    )
  )
);

const redirectToSession = (attendance, history) => (
  history.push(buildSessionUrl(attendance))
);

const buildSessionUrl = (attendance) => (
  `/interactive_sessions/${attendance.relationships.interactiveSession.id}`
);
