import { filter, mergeMap, map } from 'rxjs/operators';
import { UPDATE_ENTITY, receiveEntity } from '../actions';
import withJob from './withJob';

const updateEntityEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === UPDATE_ENTITY),
  mergeMap(action => processAction(action, dependencies))
);

export default updateEntityEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction = (action, dependencies) => (
  withJob(
    action,
    updateEntity$(action, dependencies),
    map(receiveEntity)
  )
);

const updateEntity$ = ({ entity }, { api }) => (
  api.entities.update(entity)
);
