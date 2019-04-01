import defaultsDeep from 'lodash/defaultsDeep';
import {
  POLL_CREATED, POLL_DESTROYED, POLL_UPDATED
} from '../src/constants/eventTypes';

export const pollCreated = (obj) => (defaultsDeep({}, obj, {
  type: POLL_CREATED,
  pollId: '200',
}));

export const pollDestroyed = (obj) => (defaultsDeep({}, obj, {
  type: POLL_DESTROYED,
  pollId: '200',
}));

export const pollUpdated = (obj) => (defaultsDeep({}, obj, {
  type: POLL_UPDATED,
  pollId: '200',
}));

export default { pollCreated, pollDestroyed, pollUpdated };
