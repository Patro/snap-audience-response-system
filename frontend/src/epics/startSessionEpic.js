import { of, concat } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { START_SESSION, receiveEntity } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes'
import reloadCollections from './reloadCollections';
import withJob from './withJob';

const startSessionEpic = (action$, state$, dependencies) => action$.pipe(
  filter(action => action.type === START_SESSION),
  mergeMap(action => processAction$(action, state$, dependencies)),
);

export default startSessionEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction$ = (action, state$, dependencies) => (
  withJob(
    action,
    createSession$(action, dependencies),
    onSuccess(state$, dependencies)
  )
);

const createSession$ = ({ label }, { api, history }) => (
  api.entities.create({
    type: INTERACTIVE_SESSION,
    attributes: { label },
  })
);

const onSuccess = (state$, dependencies) => (
  mergeMap((session) =>
    concat(
      of(receiveEntity(session)),
      reloadCollections(state$, session.type, dependencies),
      of(session).pipe(
        tap(session => redirectToSessionOwner(session, dependencies.history)),
      )
    )
  )
);

const redirectToSessionOwner = (session, history) => (
  history.push(buildSessionOwnerUrl(session))
);

const buildSessionOwnerUrl = (session) => (
  `/interactive_sessions/${session.id}/owner`
);
