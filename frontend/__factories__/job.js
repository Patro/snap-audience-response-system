import defaultsDeep from 'lodash/defaultsDeep';
import interactiveSession from './interactiveSession';
import { STARTED, SUCCEEDED, FAILED } from './../src/constants/jobStatus';

export const started = (obj) => (defaultsDeep({}, obj, {
  id: 'jobId',
  status: STARTED,
  trigger: {},
}));

export const succeeded = (obj) => (defaultsDeep({}, obj, {
  id: 'jobId',
  status: SUCCEEDED,
  trigger: {},
  result: interactiveSession.entity(),
}));

export const failed = (obj) => (defaultsDeep({}, obj, {
  id: 'jobId',
  status: FAILED,
  trigger: {},
}));

export default { started, succeeded, failed };
