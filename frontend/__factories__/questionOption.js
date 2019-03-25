import defaultsDeep from 'lodash/defaultsDeep';
import { QUESTION_OPTION } from '../src/constants/entityTypes';
import singleChoiceQuestion from './singleChoiceQuestion';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (defaultsDeep({}, obj, {
  type: QUESTION_OPTION,
  id: nextId(),
}));

export const entity = (obj) => (defaultsDeep({}, obj, {
  id: nextId(),
  type: QUESTION_OPTION,
  attributes: { text: '42' },
  relationships: {
    question: singleChoiceQuestion.identifier(),
  },
}));

export const collectionWithIds = (ids) => ({
  entities: ids.map((id) => identifier({ id })),
});

export default { identifier, entity, collectionWithIds };
