import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { JSON_API_MIME_TYPE } from './config';
import { buildURL, buildBody, mapResponse } from './helpers'

export const create = (entity = {}) => (
  ajax({
    url: buildURL({ type: entity.type }),
    method: 'POST',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
      'Content-Type': JSON_API_MIME_TYPE,
    },
    body: JSON.stringify(buildBody(entity))
  }).pipe(
    map(ajaxResponse => ajaxResponse.response),
    map(mapResponse)
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
    map(mapResponse)
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
    map(mapResponse)
  )
);

export default { create, fetch, fetchCollection }
