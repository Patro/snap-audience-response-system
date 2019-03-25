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
    map(xhr => mapResponse(xhr.response))
  )
);

export const fetch = ({ type, id } = {}) => (
  ajax({
    url: buildURL({ type, id }),
    method: 'GET',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
    }
  }).pipe(
    map(xhr => mapResponse(xhr.response))
  )
);

export default { create, fetch }
