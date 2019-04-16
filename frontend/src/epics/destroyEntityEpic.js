import { filter, mergeMap, mapTo } from 'rxjs/operators';
import { DESTROY_ENTITY, receiveEntity } from '../actions';
import withJob from './withJob';

const destroyEntityEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === DESTROY_ENTITY),
  mergeMap(action => processAction(action, dependencies))
);

export default destroyEntityEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction = (action, dependencies) => (
  withJob(
    action,
    destroyEntity$(action, dependencies),
    mapTo(receiveEntity({ ...action.entity, deleted: true }))
  )
);

const destroyEntity$ = ({ entity }, { api }) => (
  api.entities.destroy(entity)
);
