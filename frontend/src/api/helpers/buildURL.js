import Immutable from 'immutable';
import snakeCase from 'lodash/snakeCase';
import { API_ROOT_PATH, ROOT_TYPE_MAP } from './../config';

const buildURL = (resource) => {
  const parts = [API_ROOT_PATH];
  addCollectionPath(parts, resource.get('type'));
  addId(parts, resource.get('id'));
  addQueryParams(parts, resource.get('filterParams'));
  return parts.join('');
};
export default buildURL;

const addCollectionPath = (parts, type) => (
  parts.push('/', getCollectionPath(type))
);

const getCollectionPath = (type) => {
  type = ROOT_TYPE_MAP[type] || type;
  return `${snakeCase(type)}s`;
};

const addId = (parts, id) => {
  if (id === undefined) { return; }
  parts.push('/', id);
};

const addQueryParams = (parts, filterParams) => {
  if (filterParams === undefined) { return; }
  parts.push('?', serializeQueryParams(filterParams))
};

const serializeQueryParams = (params) => (
  serializedQueryPairs(params).join('&')
);

const serializedQueryPairs = (params) => (
  params.reduce((pairs, value, key) => (
    pairs.push(serializeQueryPair(key, value))
  ), Immutable.List())
);

const encode = encodeURIComponent;
const serializeQueryPair = (key, value) => (
  encode(snakeCase(key)) + '=' + encode(value)
);
