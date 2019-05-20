import Immutable from 'immutable';
import { RECEIVE_COLLECTION } from '../actions';

const entities = (state = Immutable.fromJS({}), action) => {
  switch(action.type) {
    case RECEIVE_COLLECTION:
      return receiveCollection(state, action.collection)
    default:
      return state;
  };
};

export default entities;

///////////////////////////////////////////////////////////////////////////////

const receiveCollection = (state, collection) => (
  state.setIn(
    [collection.get('type'), collection.get('filterParams')],
    mapCollection(collection)
  )
);

const mapCollection = (collection) => Immutable.Map({
  type: collection.get('type'),
  filterParams: collection.get('filterParams'),
  entities: collection.get('entities').map(mapEntityToIdentifier),
});

const mapEntityToIdentifier = (entity) => Immutable.Map({
  id: entity.get('id'),
  type: entity.get('type'),
});
