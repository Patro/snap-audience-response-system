import Immutable from 'immutable';

export const unprocessableEntity = (obj) => (
  Immutable.fromJS({
    status: 412,
    title: 'Unprocessable Entity',
    detail: 'Attribute is missing',
  }).mergeDeep(Immutable.fromJS(obj))
);

export default { unprocessableEntity };
