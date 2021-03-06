import Immutable from 'immutable';
import { filter, mergeMap, map } from 'rxjs/operators';
import { FETCH_ENTITY, receiveEntity } from '../actions';
import withJob from './withJob';

const fetchEntityEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === FETCH_ENTITY),
  mergeMap(action => processAction$(action, dependencies))
);

export default fetchEntityEpic;

///////////////////////////////////////////////////////////////////////////////

const processAction$ = (action, dependencies) => (
  withJob(
    action,
    fetchEntity$(action, dependencies),
    map(receiveEntity)
  )
);

const fetchEntity$ = (action, { api }) => (
  api.entities.fetch(Immutable.Map({
    type: action.entityType,
    id: action.entityId,
  }))
);
