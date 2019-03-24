import get from 'lodash/get';

const getEntity = (state, type, id) => {
  return get(state, `entities.${type}.${id}`);
};

export default getEntity;
