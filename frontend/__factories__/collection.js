import Immutable from 'immutable';

export const withEntities = (given) => Immutable.fromJS({
  entities: given.map((entity) => ({
    type: entity.get('type'),
    id: entity.get('id'),
  })),
});

export default { withEntities };
