import Immutable from 'immutable';
import collections from './collections';
import { receiveCollection } from '../actions';

describe('collections reducer', () => {
  describe('on RECEIVE_COLLECTION', () => {
    it('adds collection to store', () => {
      const stateBefore = Immutable.Map({
        CAR: Immutable.Map().set(
          Immutable.Map({}),
          Immutable.fromJS({ entities: [] })
        ),
      });
      const action = receiveCollection({
        type: 'VEHICLE',
        filterParams: { fuel: 'diesel' },
        entities: [
          { id: '2', type: 'CAR', attributes: { maxSpeed: 200 } },
          { id: '2', type: 'TRUCK', attributes: { maxSpeed: 100 } },
          { id: '3', type: 'TRUCK', attributes: { maxSpeed: 100 } },
        ],
      });
      const stateAfter = Immutable.Map({
        CAR: Immutable.Map().set(
          Immutable.Map({}),
          Immutable.fromJS({ entities: [] })
        ),
        VEHICLE: Immutable.Map().set(
          Immutable.Map({ fuel: 'diesel' }),
          Immutable.fromJS({
            type: 'VEHICLE',
            filterParams: { fuel: 'diesel' },
            entities: [
              { id: '2', type: 'CAR' },
              { id: '2', type: 'TRUCK' },
              { id: '3', type: 'TRUCK' },
            ],
          })
        ),
      });

      expect(collections(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
