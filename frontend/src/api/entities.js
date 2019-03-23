import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import {
  buildURL, buildBody, mapSingleResourceDocumentToEntity
} from './helpers'

export const create = ({ type, attributes } = {}) => (
  ajax({
    url: buildURL({ type }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json'
    },
    body: JSON.stringify(buildBody({ type, attributes }))
  })
);

export const fetch = ({ id, type } = {}) => (
  ajax({
    url: buildURL({ id, type }),
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.api+json'
    }
  }).pipe(
    map(ajaxResponse => ajaxResponse.response),
    map(mapSingleResourceDocumentToEntity)
  )
);

export default { create, fetch }
