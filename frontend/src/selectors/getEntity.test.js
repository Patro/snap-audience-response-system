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
        expect(getEntity(state, 'SPACESHIP', '100')).toEqual({ id: 100 });
      });
    });

    describe('when entity with id does not exist', () => {
      it('returns undefined', () => {
        expect(getEntity(state, 'SPACESHIP', '101')).toBeUndefined();
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
      expect(getEntity(state, 'SPACESHIP', '100')).toBeUndefined();
    });
  });

  describe('given empty state', () => {
    const state = {};

    it('returns undefined', () => {
      expect(getEntity(state, 'SPACESHIP', '100')).toBeUndefined();
    });
  });
});
