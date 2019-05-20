import Immutable from 'immutable';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { JSON_API_MIME_TYPE } from './config';
import { buildURL, mapResponse } from './helpers'

export const fetch = (collection) => (
  ajax({
    url: buildURL(collection),
    method: 'GET',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
    }
  }).pipe(
    map(xhr => Immutable.fromJS(xhr.response)),
    map(response => (
      mapResponse(response).merge({
        type: collection.get('type'),
        filterParams: collection.get('filterParams'),
      })
    ))
  )
);

export default { fetch };
