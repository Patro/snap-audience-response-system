import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import collections from './collections';

jest.mock('rxjs/ajax');
jest.mock('./config');

describe('collections', () => {
  describe('fetch', () => {
    it('configures get request', () => {
      ajax.mockReturnValue(of({}));

      collections.fetch({
        type: 'SPACESHIP',
        filterParams: { q: 'space & atmosphere' },
      });

      expect(ajax).toBeCalledWith({
        method: 'GET',
        url: '/test_api/spaceships?q=space%20%26%20atmosphere',
        headers: {
          'Accept': 'application/vnd.api+json'
        },
      });
    });

    it('maps response to collection', (done) => {
      const originalResponse = {
        data: [
          {
            id: 100,
            type: 'spaceship_engine',
            attributes: {
              max_speed: 100000,
            },
          },
        ],
      }
      ajax.mockReturnValue(of({ response: originalResponse }));

      const mappedResponse = {
        type: 'SPACESHIP_ENGINE',
        filterParams: { fuel: 'gas' },
        entities: [
          {
            id: 100,
            type: 'SPACESHIP_ENGINE',
            attributes: {
              maxSpeed: 100000,
            },
          }
        ]
      }
      collections.fetch({
        type: 'SPACESHIP_ENGINE',
        filterParams: { fuel: 'gas' },
      }).subscribe(response => {
        expect(response).toEqual(mappedResponse);
        done();
      });
    });
  });
});
