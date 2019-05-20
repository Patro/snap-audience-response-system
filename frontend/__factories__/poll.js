import Immutable from 'immutable'
import { POLL } from './../src/constants/entityTypes';
import singleChoiceQuestion from './singleChoiceQuestion';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (
  Immutable.fromJS({
    type: POLL,
    id: `${nextId()}`,
  }).mergeDeep(Immutable.fromJS(obj))
);

export const entity = (obj) => (
  Immutable.fromJS({
    id: `${nextId()}`,
    type: POLL,
    attributes: { status: 'open' },
    relationships: {
      question: singleChoiceQuestion.identifier(),
    },
  }).mergeDeep(Immutable.fromJS(obj))
);

export const collectionWithIds = (ids) => (
  Immutable.fromJS({
    type: POLL,
    filterParams: {},
    entities: ids.map((id) => identifier({ id })),
  })
);

export default { identifier, entity, collectionWithIds };
