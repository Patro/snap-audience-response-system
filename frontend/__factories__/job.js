import defaultsDeep from 'lodash/defaultsDeep';
import { STARTED } from './../src/constants/jobStatus';

export const started = (obj) => (defaultsDeep({}, obj, {
  id: 'jobId',
  status: STARTED,
}));

export default { started };
