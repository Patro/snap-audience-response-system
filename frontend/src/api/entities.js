import Immutable from 'immutable';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { JSON_API_MIME_TYPE } from './config';
import { buildURL, buildBody, mapResponse } from './helpers'

export const create = (entity) => (
  ajax({
    url: buildURL(entity),
    method: 'POST',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
      'Content-Type': JSON_API_MIME_TYPE,
    },
    body: JSON.stringify(buildBody(entity))
  }).pipe(
    map(xhr => Immutable.fromJS(xhr.response)),
    map(mapResponse)
  )
);

export const fetch = (entity) => (
  ajax({
    url: buildURL(entity),
    method: 'GET',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
    }
  }).pipe(
    map(xhr => Immutable.fromJS(xhr.response)),
    map(mapResponse)
  )
);

export const update = (entity) => (
  ajax({
    url: buildURL(entity),
    method: 'PATCH',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
      'Content-Type': JSON_API_MIME_TYPE,
    },
    body: JSON.stringify(buildBody(entity))
  }).pipe(
    map(xhr => Immutable.fromJS(xhr.response)),
    map(mapResponse)
  )
);

export const destroy = (entity) => (
  ajax({
    url: buildURL(entity),
    method: 'DELETE',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
    },
  }).pipe(
    map(_ => entity.set('deleted', true))
  )
);

export default { create, fetch, update, destroy }
