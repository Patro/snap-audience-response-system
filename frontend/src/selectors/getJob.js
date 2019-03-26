import get from 'lodash/get';

const getJob = (state, id) => {
  return get(state, `jobs.${id}`);
};

export default getJob;
