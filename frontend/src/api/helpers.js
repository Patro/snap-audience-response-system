import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
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

const serializeQueryParams = (params) => {
  if (params === undefined) { return ''; }
  const keys = Object.keys(params);
  const pairs = keys.map(key => {
    const encKey = encodeURIComponent(snakeCase(key));
    const encValue = encodeURIComponent(params[key]);
    return `${encKey}=${encValue}`;
  })
  return pairs.join('&');
};

export const buildURL = ({id, type, filterParams }) => {
  const parts = [API_ROOT_PATH, `${snakeCase(type)}s/`];
  if (id !== undefined) {
    parts.push(`${id}`)
  }
  const queryParams = serializeQueryParams(filterParams);
  if (queryParams.length > 0) {
    parts.push(`?${queryParams}`)
  }
  return parts.join('');
};

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

const mapResourceIdentifier = (resourceIdentifer) => ({
  id: resourceIdentifer.id,
  type: toUpper(resourceIdentifer.type),
});

const mapResourceObjectRelationship = (relationship) => {
  if (isArray(relationship.data)) {
    return relationship.data.map(mapResourceIdentifier);
  }
  else if (isObject(relationship.data)) {
    return mapResourceIdentifier(relationship.data);
  }
}

const mapResourceObjectRelationships = (relationships) => {
  const keys = Object.keys(relationships);
  const mapped = {};
  keys.forEach(key => {
    const relationship = relationships[key];
    mapped[camelCase(key)] = mapResourceObjectRelationship(relationship);
  });
  return mapped;
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
  const relationships = resourceObject.relationships;
  if (relationships !== undefined) {
    entity.relationships = mapResourceObjectRelationships(relationships);
  }
  return entity;
};

export const mapSingleResourceToEntity = (document) => (
  mapResourceObjectToEntity(document.data)
);

export const mapCollectionResourceToCollection = (document) => ({
  entities: document.data.map(mapResourceObjectToEntity)
});
