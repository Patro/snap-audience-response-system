import defaultsDeep from 'lodash/defaultsDeep';
import { INTERACTIVE_SESSION } from '../src/constants/entityTypes';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (defaultsDeep({}, obj, {
  type: INTERACTIVE_SESSION,
  id: `${nextId()}`,
}));

export const entity = (obj) => (defaultsDeep({}, obj, {
  id: `${nextId()}`,
  type: INTERACTIVE_SESSION,
  attributes: {
    label: 'My Session',
  },
}));

export default { identifier, entity };
