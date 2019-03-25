import { filter, mergeMap, map } from 'rxjs/operators';
import { FETCH_COLLECTION, receiveCollection } from '../actions';
import withJob from './withJob';

const fetchCollection$ = ({ entityType, filterParams }, { api }) => (
  api.collections.fetch({ type: entityType, filterParams })
);

const processAction = (action, dependencies) => (
  withJob(
    action.jobId,
    fetchCollection$(action, dependencies),
    map(collection =>
      receiveCollection(action.entityType, action.filterParams, collection)
    )
  )
);

const fetchCollectionEpic = (action$, _, dependencies) => action$.pipe(
  filter(action => action.type === FETCH_COLLECTION),
  mergeMap(action => processAction(action, dependencies))
);

export default fetchCollectionEpic;
