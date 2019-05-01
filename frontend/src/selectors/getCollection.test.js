import getCollection from './getCollection';

describe('getCollection', () => {
  describe('given state with collections', () => {
    const collection = {
      entities: [
        { type: 'SPACESHIP_ENGINE', id: '100' }
      ]
    };
    const state = {
      collections: {
        SPACESHIP_ENGINE: {
          '{"fuel":"hydrogen"}': collection,
        },
      },
    };

    describe('when collection with filter params exists', () => {
      it('returns collection', () => {
        const filterParams = { fuel: 'hydrogen' }
        const result = getCollection(state, 'SPACESHIP_ENGINE', filterParams)
        expect(result).toEqual(collection);
      });
    });

    describe('when collection with filter params does not exist', () => {
      it('returns undefined', () => {
        const filterParams = { fuel: 'electricity' }
        const result = getCollection(state, 'SPACESHIP_ENGINE', filterParams)
        expect(result).toBeUndefined();
      });
    });
  });

  describe('given state with collections in differnt group', () => {
    const collection = {
      entities: [
        { type: 'CAR', id: '100' }
      ]
    };
    const state = {
      collections: {
        CAR: {
          '{"fuel":"hydrogen"}': collection,
        },
      },
    };

    it('returns undefined', () => {
      const filterParams = { fuel: 'hydrogen' }
      const result = getCollection(state, 'SPACESHIP_ENGINE', filterParams)
      expect(result).toBeUndefined();
    });
  });

  describe('given empty state', () => {
    const state = {};

    it('returns undefined', () => {
      const filterParams = { fuel: 'hydrogen' }
      const result = getCollection(state, 'SPACESHIP_ENGINE', filterParams)
      expect(result).toBeUndefined()
    });
  });
});
