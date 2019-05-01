import collections from './collections';
import { receiveCollection } from '../actions';

describe('collections reducer', () => {
  describe('on RECEIVE_COLLECTION', () => {
    it('adds collection to store', () => {
      const stateBefore = {
        CAR: {
          '{}': { entities: [] },
        },
      };
      const action = receiveCollection({
        type: 'VEHICLE',
        filterParams: { fuel: 'gas' },
        entities: [
          { id: '2', type: 'CAR', attributes: { maxSpeed: 200 } },
          { id: '2', type: 'SPACESHIP', attributes: { maxSpeed: 100000 } },
          { id: '3', type: 'SPACESHIP', attributes: { maxSpeed: 400000 } },
        ],
      });
      const stateAfter = {
        CAR: {
          '{}': { entities: [] },
        },
        VEHICLE: {
          '{"fuel":"gas"}': {
            type: 'VEHICLE',
            filterParams: { fuel: 'gas' },
            entities: [
              { id: '2', type: 'CAR' },
              { id: '2', type: 'SPACESHIP' },
              { id: '3', type: 'SPACESHIP' },
            ]
          }
        },
      };

      expect(collections(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
