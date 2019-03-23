import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import {
  buildURL, buildBody, mapSingleResourceDocumentToEntity
} from './helpers'

const JSON_API_MIME_TYPE = 'application/vnd.api+json';

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
    map(mapSingleResourceDocumentToEntity)
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
    map(mapSingleResourceDocumentToEntity)
  )
);

export default { create, fetch }
