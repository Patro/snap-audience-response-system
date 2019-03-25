import { filter, mergeMap, map } from 'rxjs/operators';
import { FETCH_ENTITY, receiveEntity } from '../actions';
import withJob from './withJob';

const fetchEntity$ = ({ entityType, entityId }, { api }) => (
  api.entities.fetch({ type: entityType, id: entityId })
);

const processAction = (action, dependencies) => (
  withJob(
    action.jobId,
    fetchEntity$(action, dependencies),
    map(receiveEntity)
  )
);

const fetchEntityEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === FETCH_ENTITY),
  mergeMap(action => processAction(action, dependencies))
);

export default fetchEntityEpic;
