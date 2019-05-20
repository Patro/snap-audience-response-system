import Immutable from 'immutable';
import { INTERACTIVE_SESSION } from '../src/constants/entityTypes';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (
  Immutable.fromJS({
    type: INTERACTIVE_SESSION,
    id: `${nextId()}`,
  }).mergeDeep(Immutable.fromJS(obj))
);

export const entity = (obj) => (
  Immutable.fromJS({
    id: `${nextId()}`,
    type: INTERACTIVE_SESSION,
    attributes: {
      label: 'My Session',
    },
  }).mergeDeep(Immutable.fromJS(obj))
);

export default { identifier, entity };
