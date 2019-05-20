import Immutable from 'immutable';
import buildTestState from '../utils/buildTestState';
import getEntitiesOfCollection from './getEntitiesOfCollection';

const entities = Immutable.fromJS([
  { id: '100', type: 'SPACESHIP', attributes: { name: 'A' } },
  { id: '101', type: 'SPACESHIP', attributes: { name: 'B' } },
  { id: '102', type: 'SPACESHIP', attributes: { name: 'C' } },
]);

const collection = Immutable.fromJS({
  type: 'SPACESHIP',
  filterParams: { color: 'black' },
  entities: [
    { id: '100', type: 'SPACESHIP'},
    { id: '102', type: 'SPACESHIP'},
  ],
});

describe('getEntitesOfCollection', () => {
  describe('given state with entities', () => {
    const state = buildTestState({ collections: [collection], entities });

    it('returns array of entities', () => {
      const entities = getEntitiesOfCollection(
        state, 'SPACESHIP', { color: 'black' }
      );

      expect(entities).toEqual(Immutable.fromJS([
        { id: '100', type: 'SPACESHIP', attributes: { name: 'A' } },
        { id: '102', type: 'SPACESHIP', attributes: { name: 'C' } },
      ]));
    });
  });

  describe('given state without entities', () => {
    const state = buildTestState({ collections: [collection] });

    it('returns empty list', () => {
      const entities = getEntitiesOfCollection(
        state, 'SPACESHIP', { color: 'black' }
      );

      expect(entities).toEqual(Immutable.List());
    });
  });

  describe('given empty state', () => {
    const state = Immutable.Map();

    it('returns undefined', () => {
      const entities = getEntitiesOfCollection(
        state, 'SPACESHIP', { color: 'black' }
      );

      expect(entities).toBeUndefined();
    });
  });
});
