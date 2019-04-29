import { of, concat } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { CREATE_ENTITY, receiveEntity } from '../actions';
import reloadCollections from './reloadCollections';
import withJob from './withJob';

const createEntityEpic = (action$, state$, dependencies) => action$.pipe(
  filter(action => action.type === CREATE_ENTITY),
  mergeMap(action => processAction$(action, state$, dependencies))
);

export default createEntityEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction$ = (action, state$, dependencies) => (
  withJob(
    action,
    createEntity$(action, dependencies),
    onSuccess(state$, dependencies)
  )
);

const createEntity$ = ({ entity }, { api }) => (
  api.entities.create(entity)
);

const onSuccess = (state$, dependencies) => (
  mergeMap(entity =>
    concat(
      of(receiveEntity(entity)),
      reloadCollections(state$, entity.type, dependencies),
    )
  )
);
