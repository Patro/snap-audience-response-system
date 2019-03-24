import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { JSON_API_MIME_TYPE } from './config';
import {
  buildURL,
  buildBody,
  mapSingleResourceToEntity,
  mapCollectionResourceToCollection
} from './helpers'

export const create = ({ type, attributes } = {}) => (
  ajax({
    url: buildURL({ type }),
    method: 'POST',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
      'Content-Type': JSON_API_MIME_TYPE,
    },
    body: JSON.stringify(buildBody({ type, attributes }))
  }).pipe(
    map(ajaxResponse => ajaxResponse.response),
    map(mapSingleResourceToEntity)
  )
);

export const fetch = ({ id, type } = {}) => (
  ajax({
    url: buildURL({ id, type }),
    method: 'GET',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
    }
  }).pipe(
    map(ajaxResponse => ajaxResponse.response),
    map(mapSingleResourceToEntity)
  )
);

export const fetchCollection = ({ type, filterParams } = {}) => (
  ajax({
    url: buildURL({ type, filterParams }),
    method: 'GET',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
    }
  }).pipe(
    map(ajaxResponse => ajaxResponse.response),
    map(mapCollectionResourceToCollection)
  )
);

export default { create, fetch, fetchCollection }
