import defaultsDeep from 'lodash/defaultsDeep';

export const unprocessableEntity = (obj) => (defaultsDeep({}, obj, {
  status: 412,
  title: 'Unprocessable Entity',
  detail: 'Attribute is missing',
}));

export default { unprocessableEntity };
