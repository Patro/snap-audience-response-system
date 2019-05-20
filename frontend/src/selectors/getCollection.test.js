import Immutable from 'immutable';
import buildTestState from '../utils/buildTestState';
import getCollection from './getCollection';

describe('getCollection', () => {
  describe('given state with collections', () => {
    const collection = Immutable.fromJS({
      type: 'SPACESHIP_ENGINE',
      filterParams: { fuel: 'hydrogen' },
      entities: [
        { type: 'SPACESHIP_ENGINE', id: '100' }
      ]
    });
    const state = buildTestState({ collections: [collection] });

    describe('when collection with filter params exists', () => {
      it('returns collection', () => {
        const filterParams = { fuel: 'hydrogen' };
        const result = getCollection(state, 'SPACESHIP_ENGINE', filterParams);
        expect(result).toEqual(collection);
      });
    });

    describe('when collection with filter params does not exist', () => {
      it('returns undefined', () => {
        const filterParams = { fuel: 'electricity' };
        const result = getCollection(state, 'SPACESHIP_ENGINE', filterParams);
        expect(result).toBeUndefined();
      });
    });
  });

  describe('given state with collections in differnt group', () => {
    const collection = Immutable.fromJS({
      type: 'CAR',
      filterParams: { fuel: 'hydrogen' },
      entities: [
        { type: 'CAR', id: '100' }
      ]
    });
    const state = buildTestState({ collections: [collection] });

    it('returns undefined', () => {
      const filterParams = { fuel: 'hydrogen' };
      const result = getCollection(state, 'SPACESHIP_ENGINE', filterParams);
      expect(result).toBeUndefined();
    });
  });

  describe('given empty state', () => {
    const state = Immutable.Map();

    it('returns undefined', () => {
      const filterParams = { fuel: 'hydrogen' };
      const result = getCollection(state, 'SPACESHIP_ENGINE', filterParams);
      expect(result).toBeUndefined();
    });
  });
});
