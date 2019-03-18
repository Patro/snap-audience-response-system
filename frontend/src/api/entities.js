import { ajax } from 'rxjs/ajax';
import { buildURL, buildBody } from './helpers'

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

export default { create }
