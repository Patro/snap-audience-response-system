import Immutable from 'immutable';
import { MULTIPLE_CHOICE_QUESTION } from '../src/constants/entityTypes';
import interactiveSession from './interactiveSession';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (
  Immutable.fromJS({
    type: MULTIPLE_CHOICE_QUESTION,
    id: `${nextId()}`,
  }).mergeDeep(Immutable.fromJS(obj))
);

export const entity = (obj) => (
  Immutable.fromJS({
    id: `${nextId()}`,
    type: MULTIPLE_CHOICE_QUESTION,
    attributes: { text: 'What is 2 + 4?' },
    relationships: {
      interactiveSession: interactiveSession.identifier(),
    },
  }).mergeDeep(Immutable.fromJS(obj))
);

export default { identifier, entity };
