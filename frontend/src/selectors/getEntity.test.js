import Immutable from 'immutable';
import buildTestState from '../utils/buildTestState';
import getEntity from './getEntity';

describe('getEntitiy', () => {
  describe('given state with entities', () => {
    const entity = Immutable.fromJS({
      type: 'SPACESHIP',
      id: '100',
      attributes: { fuel: 'hydrogen' },
    });
    const state = buildTestState({ entities: [entity] });

    describe('when entity with id exists', () => {
      describe('given identifier as object', () => {
        it('returns entity', () => {
          const entity = getEntity(state, { type: 'SPACESHIP', id: '100' });
          expect(entity).toEqual(entity);
        });
      });

      describe('given identifier as immutable', () => {
        it('returns entity', () => {
          const entity = getEntity(state, Immutable.fromJS({
            type: 'SPACESHIP',
            id: '100',
          }));
          expect(entity).toEqual(entity);
        });
      });
    });

    describe('when entity with id does not exist', () => {
      it('returns undefined', () => {
        const entity = getEntity(state, { type: 'SPACESHIP', id: '101' });
        expect(entity).toBeUndefined();
      });
    });
  });

  describe('given state with entities in differnt group', () => {
    const entity = Immutable.fromJS({
      type: 'CAR',
      id: '100',
      attributes: { fuel: 'hydrogen' },
    });
    const state = buildTestState({ entities: [entity] });

    it('returns undefined', () => {
      const entity = getEntity(state, { type: 'SPACESHIP', id: '100' });
      expect(entity).toBeUndefined();
    });
  });

  describe('given empty state', () => {
    const state = Immutable.Map();

    it('returns undefined', () => {
      const entity = getEntity(state, { type: 'SPACESHIP', id: '100' });
      expect(entity).toBeUndefined();
    });
  });
});
