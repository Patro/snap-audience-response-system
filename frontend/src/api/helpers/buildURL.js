import snakeCase from 'lodash/snakeCase';
import { API_ROOT_PATH, ROOT_TYPE_MAP } from './../config';

const buildURL = ({ id, type, filterParams }) => {
  const parts = [API_ROOT_PATH];
  addCollectionPath(parts, type);
  addId(parts, id);
  addQueryParams(parts, filterParams);
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

const serializeQueryParams = (params) => {
  const keys = Object.keys(params);
  const pairs = keys.map(key => serializeQueryPair(key, params[key]));
  return pairs.join('&');
};

const encode = encodeURIComponent;
const serializeQueryPair = (key, value) => (
  encode(snakeCase(key)) + '=' + encode(value)
);
