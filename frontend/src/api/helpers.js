import camelCase from 'lodash/camelCase';
import isObject from 'lodash/isObject';
import snakeCase from 'lodash/snakeCase';
import toUpper from 'lodash/toUpper';
import { API_ROOT_PATH } from './config';

const deepMapKeys = (object, iteratee) => {
  const mapped = {}
  Object.keys(object).forEach((key) => {
    let value = object[key];
    if(isObject(value)) {
      value = deepMapKeys(value, iteratee);
    }
    mapped[iteratee(key)] = value;
  });
  return mapped;
};

const deepMapKeysToSnakeCase = (object) => (
  deepMapKeys(object, snakeCase)
);

const deepMapKeysToCamelCase = (object) => (
  deepMapKeys(object, camelCase)
);

export const buildURL = ({id = '', type }) => (
  `${API_ROOT_PATH}${snakeCase(type)}s/${id}`
);

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

export const mapResourceObjectToEntity = (resourceObject) => {
  const entity = {};
  const id = resourceObject.id;
  if (id !== undefined) {
    entity.id = id;
  }
  const type = resourceObject.type;
  if (type !== undefined) {
    entity.type = toUpper(type);
  }
  const attributes = resourceObject.attributes;
  if (attributes !== undefined) {
    entity.attributes =  deepMapKeysToCamelCase(attributes);
  }
  return entity;
};

export const mapSingleResourceDocumentToEntity = (document) => (
  mapResourceObjectToEntity(document.data)
);
