import { of, concat } from 'rxjs';
import { filter, mergeMap} from 'rxjs/operators';
import { DESTROY_ENTITY, receiveEntity } from '../actions';
import reloadCollections from './reloadCollections';
import withJob from './withJob';

const destroyEntityEpic = (action$, state$, dependencies) => action$.pipe(
  filter(action => action.type === DESTROY_ENTITY),
  mergeMap(action => processAction$(action, state$, dependencies)),
);

export default destroyEntityEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction$ = (action, state$, dependencies) => (
  withJob(
    action,
    destroyEntity$(action.entity, dependencies),
    onSuccess(state$, dependencies)
  )
);

const destroyEntity$ = (entity, { api }) => (
  api.entities.destroy(entity)
);

const onSuccess = (state$, dependencies) => (
  mergeMap(entity =>
    concat(
      of(receiveEntity(entity)),
      reloadCollections(state$, entity.get('type'), dependencies),
    )
  )
);
