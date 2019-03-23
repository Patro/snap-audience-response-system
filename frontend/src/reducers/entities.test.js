import entities from './entities';
import { receiveEntity } from '../actions';

describe('entities reducer', () => {
  it('should handle RECEIVE_ENTITY', () => {
    const stateBefore = {
      CAR: {
        1: { id: 1, type: 'CAR' },
      },
    };
    const action = receiveEntity({
      id: 2,
      type: 'SPACESHIP',
      attributes: {
        maxSpeed: 100000,
      },
    });
    const stateAfter = {
      CAR: {
        1: { id: 1, type: 'CAR' },
      },
      SPACESHIP: {
        2: { id: 2, type: 'SPACESHIP', attributes: { maxSpeed: 100000 } },
      },
    };

    expect(entities(stateBefore, action)).toEqual(stateAfter);
  });
});
