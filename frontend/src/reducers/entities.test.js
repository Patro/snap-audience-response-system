import entities from './entities';
import { receiveEntity, receiveCollection } from '../actions';

describe('entities reducer', () => {
  describe('on RECEIVE_COLLECTION', () => {
    it('adds entities of collection to store', () => {
      const stateBefore = {
        CAR: {
          '1': { id: '1', type: 'CAR' },
        },
      };
      const action = receiveCollection({
        type: 'VEHICLE',
        filterParams: {},
        entities: [
          { id: '2', type: 'CAR', attributes: { maxSpeed: 200 } },
          { id: '2', type: 'SPACESHIP', attributes: { maxSpeed: 100000 } },
          { id: '3', type: 'SPACESHIP', attributes: { maxSpeed: 400000 } },
        ]
      });
      const stateAfter = {
        CAR: {
          '1': { id: '1', type: 'CAR' },
          '2': { id: '2', type: 'CAR', attributes: { maxSpeed: 200 } },
        },
        SPACESHIP: {
          '2': { id: '2', type: 'SPACESHIP', attributes: { maxSpeed: 100000 } },
          '3': { id: '3', type: 'SPACESHIP', attributes: { maxSpeed: 400000 } },
        },
      };

      expect(entities(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('on RECEIVE_ENTITY', () => {
    it('adds entity to store', () => {
      const stateBefore = {
        CAR: { '1': { id: '1', type: 'CAR' } },
      };
      const action = receiveEntity({
        id: '2', type: 'SPACESHIP', attributes: { maxSpeed: 100000 },
      });
      const stateAfter = {
        CAR: {
          '1': { id: '1', type: 'CAR' },
        },
        SPACESHIP: {
          '2': { id: '2', type: 'SPACESHIP', attributes: { maxSpeed: 100000 } },
        },
      };

      expect(entities(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
