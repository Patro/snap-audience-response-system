import Immutable from 'immutable';
import mapResponse from './mapResponse';

describe('mapResponse', () => {
  describe('given response with single resource', () => {
    const response = Immutable.fromJS({
      data: {
        id: '3',
        type: 'spaceship',
        attributes: { max_speed: 100000 },
        relationships: {
          captain: {
            data: { type: 'crew_member', id: '12' },
          },
          spaceship_engines: {
            data: [
              { type: 'spaceship_engine', id: '430' },
              { type: 'spaceship_engine', id: '431' },
            ],
          },
        },
      },
    });

    it('maps response to entity', () => {
      const entity = mapResponse(response);
      expect(entity).toEqual(Immutable.fromJS({
        id: '3',
        type: 'SPACESHIP',
        attributes: { maxSpeed: 100000 },
        relationships: {
          captain: {
            type: 'CREW_MEMBER',
            id: '12',
          },
          spaceshipEngines: [
            { type: 'SPACESHIP_ENGINE', id: '430' },
            { type: 'SPACESHIP_ENGINE', id: '431' },
          ],
        },
      }));
    });
  });

  describe('given response with collection of resources', () => {
    const response = Immutable.fromJS({
      data: [
        { id: '3', type: 'spaceship', attributes: { max_speed: 100000 } },
        { id: '4', type: 'spaceship', attributes: { max_speed: 400000 } },
      ],
    });

    it('maps response to collection', () => {
      const entity = mapResponse(response);
      expect(entity).toEqual(Immutable.fromJS({
        entities: [
          { id: '3', type: 'SPACESHIP', attributes: { maxSpeed: 100000 } },
          { id: '4', type: 'SPACESHIP', attributes: { maxSpeed: 400000 } },
        ]
      }));
    });
  });

  describe('given empty response', () => {
    const response = Immutable.Map();

    it('maps to undefined', () => {
      expect(mapResponse(response)).toBeUndefined();
    });
  });
});
