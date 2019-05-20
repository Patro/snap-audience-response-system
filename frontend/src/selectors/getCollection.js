import Immutable from 'immutable';

const getCollection = (state, type, filterParams = {}) => (
  state.getIn(['collections', type, Immutable.fromJS(filterParams)])
);

export default getCollection;
