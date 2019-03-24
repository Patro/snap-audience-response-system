import collections from './collections';
import { receiveCollection } from '../actions';

describe('collections reducer', () => {
  it('should handle RECEIVE_COLLECTION', () => {
    const stateBefore = {
      CAR: {
        '{}': { entities: [] },
      },
    };
    const action = receiveCollection('VEHICLE', { fuel: 'gas' }, {
      entities: [
        { id: 2, type: 'CAR', attributes: { maxSpeed: 200 } },
        { id: 2, type: 'SPACESHIP', attributes: { maxSpeed: 100000 } },
        { id: 3, type: 'SPACESHIP', attributes: { maxSpeed: 400000 } },
      ]
    });
    const stateAfter = {
      CAR: {
        '{}': { entities: [] },
      },
      VEHICLE: {
        '{"fuel":"gas"}': {
          entities: [
            { id: 2, type: 'CAR' },
            { id: 2, type: 'SPACESHIP' },
            { id: 3, type: 'SPACESHIP' },
          ]
        }
      },
    };

    expect(collections(stateBefore, action)).toEqual(stateAfter);
  });
});
