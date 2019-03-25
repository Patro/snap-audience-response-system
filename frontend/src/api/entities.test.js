import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import entities from './entities';

jest.mock('rxjs/ajax');
jest.mock('./config');

const itMapsResponse = (trigger) => {
  it('maps response to entity', (done) => {
    const originalResponse = {
      data: {
        id: 100,
        type: 'spaceship_engine',
        attributes: {
          max_speed: 100000,
        },
      },
    }
    ajax.mockReturnValue(of({ response: originalResponse }));

    const mappedResponse = {
      id: 100,
      type: 'SPACESHIP_ENGINE',
      attributes: {
        maxSpeed: 100000,
      },
    }
    trigger().subscribe(response => {
      expect(response).toEqual(mappedResponse);
      done();
    });
  });
}

describe('entities', () => {
  describe('create', () => {
    it('configures post request', () => {
      ajax.mockReturnValue(of({}));

      entities.create({
        type: 'SPACESHIP',
        attributes: {
          name: 'Enterprise',
        },
      });

      expect(ajax).toBeCalledWith({
        method: 'POST',
        url: '/test_api/spaceships',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          data: {
            type: 'spaceship',
            attributes: {
              name: 'Enterprise',
            },
          },
        }),
      });
    });

    itMapsResponse(entities.create);
  });

  describe('fetch', () => {
    it('configures get request', () => {
      ajax.mockReturnValue(of({}));

      entities.fetch({
        id: 100,
        type: 'SPACESHIP',
      });

      expect(ajax).toBeCalledWith({
        method: 'GET',
        url: '/test_api/spaceships/100',
        headers: {
          'Accept': 'application/vnd.api+json'
        },
      });
    });

    itMapsResponse(entities.fetch);
  });
});
