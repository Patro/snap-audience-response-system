import Immutable from 'immutable';
import interactiveSession from './interactiveSession';
import { STARTED, SUCCEEDED, FAILED } from './../src/constants/jobStatus';

export const started = (obj) => (
  Immutable.fromJS({
    id: 'jobId',
    status: STARTED,
    trigger: {},
  }).mergeDeep(Immutable.fromJS(obj))
);

export const succeeded = (obj) => (
  Immutable.fromJS({
    id: 'jobId',
    status: SUCCEEDED,
    trigger: {},
    result: interactiveSession.entity(),
  }).mergeDeep(Immutable.fromJS(obj))
);

export const failed = (obj) => (
  Immutable.fromJS({
    id: 'jobId',
    status: FAILED,
    trigger: {},
  }).mergeDeep(Immutable.fromJS(obj))
);

export default { started, succeeded, failed };
