import defaultsDeep from 'lodash/defaultsDeep';
import { POLL } from './../src/constants/entityTypes';
import singleChoiceQuestion from './singleChoiceQuestion';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (defaultsDeep({}, obj, {
  type: POLL,
  id: `${nextId()}`,
}));

export const entity = (obj) => (defaultsDeep({}, obj, {
  id: `${nextId()}`,
  type: POLL,
  attributes: { status: 'open' },
  relationships: {
    question: singleChoiceQuestion.identifier(),
  },
}));

export const collectionWithIds = (ids) => ({
  entities: ids.map((id) => identifier({ id })),
});

export default { identifier, entity, collectionWithIds };
