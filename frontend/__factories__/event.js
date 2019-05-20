import Immutable from 'immutable';
import {
  POLL_CREATED, POLL_DESTROYED, POLL_UPDATED
} from '../src/constants/eventTypes';

export const pollCreated = (obj) => (
  Immutable.fromJS({
    type: POLL_CREATED,
    pollId: '200',
  }).mergeDeep(Immutable.fromJS(obj))
);

export const pollDestroyed = (obj) => (
  Immutable.fromJS({
    type: POLL_DESTROYED,
    pollId: '200',
  }).mergeDeep(Immutable.fromJS(obj))
);

export const pollUpdated = (obj) => (
  Immutable.fromJS({
    type: POLL_UPDATED,
    pollId: '200',
  }).mergeDeep(Immutable.fromJS(obj))
);

export default { pollCreated, pollDestroyed, pollUpdated };
