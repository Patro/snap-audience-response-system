import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { START_SESSION, receiveEntity } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes'
import withJob from './withJob';

const startSessionEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === START_SESSION),
  mergeMap(action => processAction(action, dependencies))
);

export default startSessionEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction = (action, dependencies) => (
  withJob(
    action.jobId,
    createSession$(action, dependencies),
    map(receiveEntity)
  )
);

const createSession$ = ({ label }, { api, history }) => (
  api.entities.create({
    type: INTERACTIVE_SESSION,
    attributes: { label },
  }).pipe(
    tap(session => redirectToSessionOwner(session, history))
  )
);

const redirectToSessionOwner = (session, history) => (
  history.push(buildSessionOwnerUrl(session))
);

const buildSessionOwnerUrl = (session) => (
  `/interactive_sessions/${session.id}/owner`
);
