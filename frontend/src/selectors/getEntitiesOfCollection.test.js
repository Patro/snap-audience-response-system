import getEntitiesOfCollection from './getEntitiesOfCollection';

const collection = {
  type: 'SPACESHIP',
  filterParams: { color: 'black' },
  entities: [
    { id: '100', type: 'SPACESHIP'},
    { id: '102', type: 'SPACESHIP'},
  ],
};

describe('getEntitesOfCollection', () => {
  describe('given state with entities', () => {
    const state = {
      collections: {
        SPACESHIP: {
          '{"color":"black"}': collection,
        },
      },
      entities: {
        SPACESHIP: {
          '100': { id: '100', type: 'SPACESHIP', attributes: { name: 'A' } },
          '101': { id: '101', type: 'SPACESHIP', attributes: { name: 'B' } },
          '102': { id: '102', type: 'SPACESHIP', attributes: { name: 'C' } },
        },
      },
    };

    it('returns array of entities', () => {
      const entities = getEntitiesOfCollection(
        state, collection.type, collection.filterParams
      );

      expect(entities).toEqual([
        { id: '100', type: 'SPACESHIP', attributes: { name: 'A' } },
        { id: '102', type: 'SPACESHIP', attributes: { name: 'C' } },
      ]);
    });
  });

  describe('given state without entities', () => {
    const state = {
      collections: {
        SPACESHIP: {
          '{"color":"black"}': collection,
        },
      },
    };

    it('returns empty array', () => {
      const entities = getEntitiesOfCollection(
        state, collection.type, collection.filterParams
      );

      expect(entities).toEqual([]);
    });
  });

  describe('given empty state', () => {
    const state = {};

    it('returns undefined', () => {
      const entities = getEntitiesOfCollection(
        state, collection.type, collection.filterParams
      );

      expect(entities).toBeUndefined();
    });
  });
});
