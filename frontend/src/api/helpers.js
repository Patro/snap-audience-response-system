import snakeCase from 'lodash/snakeCase';
import isObject from 'lodash/isObject';

export const ROOT_PATH = '/api/';

export const buildURL = ({id = '', type }) => (
  `${ROOT_PATH}${snakeCase(type)}s/${id}`
);

const deepMapKeysToSnakeCase = (attributes) => {
  const mapped = {}
  Object.keys(attributes).forEach((key) => {
    let value = attributes[key];
    if(isObject(value)) {
      value = deepMapKeysToSnakeCase(value);
    }
    mapped[snakeCase(key)] = value;
  });
  return mapped;
}

export const buildBody = ({ id, type, attributes }) => {
  const data = {};
  if (id !== undefined) {
    data['id'] = id;
  }
  if (type !== undefined) {
    data['type'] = snakeCase(type);
  }
  if (attributes !== undefined) {
    data['attributes'] = deepMapKeysToSnakeCase(attributes);
  }
  return { data };
};
