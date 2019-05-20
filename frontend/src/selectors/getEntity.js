import Immutable from 'immutable';

const getEntity = (state, identifier) => {
  const immutableIdentifier = Immutable.fromJS(identifier);
  return state.getIn([
    'entities',
    immutableIdentifier.get('type'),
    immutableIdentifier.get('id'),
  ]);
};

export default getEntity;
