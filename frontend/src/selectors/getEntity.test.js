import getEntity from './getEntity';

describe('getEntitiy', () => {
  describe('given state with entities', () => {
    const state = {
      entities: {
        SPACESHIP: {
          100: { id: 100 },
        },
      },
    };

    describe('when entity with id exists', () => {
      it('returns entity', () => {
        const entity = getEntity(state, { type: 'SPACESHIP', id: '100' });
        expect(entity).toEqual({ id: 100 });
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
    const state = {
      entities: {
        CAR: {
          100: { id: 100 },
        },
      },
    };

    it('returns undefined', () => {
      const entity = getEntity(state, { type: 'SPACESHIP', id: '100' });
      expect(entity).toBeUndefined();
    });
  });

  describe('given empty state', () => {
    const state = {};

    it('returns undefined', () => {
      const entity = getEntity(state, { type: 'SPACESHIP', id: '100' });
      expect(entity).toBeUndefined();
    });
  });
});
