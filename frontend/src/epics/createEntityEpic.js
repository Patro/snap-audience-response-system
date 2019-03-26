import { filter, mergeMap, map } from 'rxjs/operators';
import { CREATE_ENTITY, receiveEntity } from '../actions';
import withJob from './withJob';

const createEntityEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === CREATE_ENTITY),
  mergeMap(action => processAction(action, dependencies))
);

export default createEntityEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction = (action, dependencies) => (
  withJob(
    action.jobId,
    createEntity$(action, dependencies),
    map(receiveEntity)
  )
);

const createEntity$ = ({ entity }, { api }) => (
  api.entities.create(entity)
);
