import {
  MULTIPLE_CHOICE_QUESTION,
  QUESTION,
  SINGLE_CHOICE_QUESTION,
} from '../constants/entityTypes';

export const API_ROOT_PATH = '/api';
export const JSON_API_MIME_TYPE = 'application/vnd.api+json';
export const ROOT_TYPE_MAP = {
  [MULTIPLE_CHOICE_QUESTION]: QUESTION,
  [SINGLE_CHOICE_QUESTION]: QUESTION,
};

export default {
  API_ROOT_PATH,
  JSON_API_MIME_TYPE,
  ROOT_TYPE_MAP,
};
