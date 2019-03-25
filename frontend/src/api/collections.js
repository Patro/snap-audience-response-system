import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { JSON_API_MIME_TYPE } from './config';
import { buildURL, mapResponse } from './helpers'

export const fetch = ({ type, filterParams } = {}) => (
  ajax({
    url: buildURL({ type, filterParams }),
    method: 'GET',
    headers: {
      'Accept': JSON_API_MIME_TYPE,
    }
  }).pipe(
    map(xhr => mapResponse(xhr.response))
  )
);

export default { fetch };
