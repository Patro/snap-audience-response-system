import defaultsDeep from 'lodash/defaultsDeep';
import { QUESTION_OPTION_COUNT } from '../src/constants/entityTypes';
import poll from './poll';
import questionOption from './questionOption';

let id = 1;
const nextId = () => id++;

export const identifier = (obj) => (defaultsDeep({}, obj, {
  type: QUESTION_OPTION_COUNT,
  id: nextId(),
}));

export const entity = (obj) => (defaultsDeep({}, obj, {
  id: nextId(),
  type: QUESTION_OPTION_COUNT,
  attributes: { numberOfResponses: 10 },
  relationships: {
    poll: poll.identifier(),
    questionOption: questionOption.identifier(),
  },
}));

export default { identifier, entity };
