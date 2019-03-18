import { ajax } from 'rxjs/ajax';
import entities from './entities';

jest.mock('rxjs/ajax');

describe('entities', () => {
  describe('create', () => {
    it('configures post request', () => {
      entities.create({
        type: 'SPACESHIP',
        attributes: {
          name: 'Enterprise',
        },
      });

      expect(ajax).toBeCalledWith({
        method: 'POST',
        url: '/api/spaceships/',
        headers: {
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
  });
});
