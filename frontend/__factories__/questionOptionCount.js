import Immutable from 'immutable';
import { QUESTION_OPTION_COUNT } from '../src/constants/entityTypes';
import poll from './poll';
import questionOption from './questionOption';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (
  Immutable.fromJS({
    type: QUESTION_OPTION_COUNT,
    id: `${nextId()}`,
  }).mergeDeep(Immutable.fromJS(obj))
);

export const entity = (obj) => (
  Immutable.fromJS({
    id: `${nextId()}`,
    type: QUESTION_OPTION_COUNT,
    attributes: { numberOfResponses: 10 },
    relationships: {
      poll: poll.identifier(),
      questionOption: questionOption.identifier(),
    },
  }).mergeDeep(Immutable.fromJS(obj))
);

export default { identifier, entity };
