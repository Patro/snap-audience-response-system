import defaultsDeep from 'lodash/defaultsDeep';
import { SINGLE_CHOICE_QUESTION } from '../src/constants/entityTypes';
import interactiveSession from './interactiveSession';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (defaultsDeep({}, obj, {
  type: SINGLE_CHOICE_QUESTION,
  id: nextId(),
}));

export const entity = (obj) => (defaultsDeep({}, obj, {
  id: nextId(),
  type: SINGLE_CHOICE_QUESTION,
  attributes: { text: 'What is 2 + 4?' },
  relationships: {
    interactiveSession: interactiveSession.identifier(),
  },
}));

export default { identifier, entity };
