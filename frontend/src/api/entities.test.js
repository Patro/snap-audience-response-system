import Immutable from 'immutable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import entities from './entities';

jest.mock('rxjs/ajax');
jest.mock('./config');

const itMapsResponse = (trigger) => {
  it('maps response to entity', (done) => {
    const originalResponse = {
      data: {
        id: '100',
        type: 'spaceship_engine',
        attributes: {
          max_speed: 100000,
        },
      },
    }
    ajax.mockReturnValue(of({ response: originalResponse }));

    const mappedResponse = Immutable.fromJS({
      id: '100',
      type: 'SPACESHIP_ENGINE',
      attributes: {
        maxSpeed: 100000,
      },
    });
    trigger().subscribe(response => {
      expect(response).toEqual(mappedResponse);
      done();
    });
  });
}

describe('entities', () => {
  describe('create', () => {
    const entity = Immutable.fromJS({
      type: 'SPACESHIP',
      attributes: {
        name: 'Enterprise',
      },
    });

    it('configures post request', () => {
      ajax.mockReturnValue(of({}));

      entities.create(entity);

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

    itMapsResponse(() => entities.create(entity));
  });

  describe('fetch', () => {
    const entity = Immutable.fromJS({
      id: '100',
      type: 'SPACESHIP',
    });

    it('configures get request', () => {
      ajax.mockReturnValue(of({}));

      entities.fetch(entity);

      expect(ajax).toBeCalledWith({
        method: 'GET',
        url: '/test_api/spaceships/100',
        headers: {
          'Accept': 'application/vnd.api+json'
        },
      });
    });

    itMapsResponse(() => entities.fetch(entity));
  });

  describe('update', () => {
    const entity = Immutable.fromJS({
      id: '100',
      type: 'SPACESHIP',
      attributes: {
        name: 'Enterprise',
      },
    });

    it('configures patch request', () => {
      ajax.mockReturnValue(of({}));

      entities.update(entity);

      expect(ajax).toBeCalledWith({
        method: 'PATCH',
        url: '/test_api/spaceships/100',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
          data: {
            id: '100',
            type: 'spaceship',
            attributes: {
              name: 'Enterprise',
            },
          },
        }),
      });
    });

    itMapsResponse(() => entities.update(entity));
  });

  describe('destroy', () => {
    const entity = Immutable.fromJS({
      id: '100',
      type: 'SPACESHIP',
      attributes: {
        name: 'Enterprise',
      },
    });

    it('configures delete request', () => {
      ajax.mockReturnValue(of({}));

      entities.destroy(entity);

      expect(ajax).toBeCalledWith({
        method: 'DELETE',
        url: '/test_api/spaceships/100',
        headers: {
          'Accept': 'application/vnd.api+json',
        },
      });
    });

    it('returns entity with deleted flag set', (done) => {
      ajax.mockReturnValue(of({ response: {} }));

      const mappedResponse = Immutable.fromJS({
        id: '100',
        type: 'SPACESHIP',
        attributes: {
          name: 'Enterprise',
        },
        deleted: true,
      });
      entities.destroy(entity).subscribe(response => {
        expect(response).toEqual(mappedResponse);
        done();
      });
    });
  });
});
