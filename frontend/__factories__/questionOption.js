import Immutable from 'immutable';
import { QUESTION_OPTION } from '../src/constants/entityTypes';
import singleChoiceQuestion from './singleChoiceQuestion';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (
  Immutable.fromJS({
    type: QUESTION_OPTION,
    id: `${nextId()}`,
  }).mergeDeep(Immutable.fromJS(obj))
);

export const entity = (obj) => (
  Immutable.fromJS({
    id: `${nextId()}`,
    type: QUESTION_OPTION,
    attributes: { text: '42', correct: false, position: 0 },
    relationships: {
      question: singleChoiceQuestion.identifier(),
    },
  }).mergeDeep(Immutable.fromJS(obj))
);

export const collectionWithIds = (ids) => (
  Immutable.fromJS({
    type: QUESTION_OPTION,
    filterParams: {},
    entities: ids.map((id) => identifier({ id })),
  })
);

export default { identifier, entity, collectionWithIds };
