import { of, concat } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { UPDATE_ENTITY, receiveEntity } from '../actions';
import reloadCollections from './reloadCollections';
import withJob from './withJob';

const updateEntityEpic = (action$, state$, dependencies) => action$.pipe(
  filter(action => action.type === UPDATE_ENTITY),
  mergeMap(action => processAction(action, state$, dependencies)),
);

export default updateEntityEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction = (action, state$, dependencies) => (
  withJob(
    action,
    updateEntity$(action, dependencies),
    onSuccess(state$, dependencies)
  )
);

const updateEntity$ = (action, { api }) => (
  api.entities.update(action.entity)
);

const onSuccess = (state$, dependencies) => (
  mergeMap((entity) =>
    concat(
      of(receiveEntity(entity)),
      reloadCollections(state$, entity.get('type'), dependencies),
    )
  )
);
