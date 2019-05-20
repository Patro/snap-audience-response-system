import Immutable from 'immutable';
import buildURL from './buildURL';

jest.mock('./../config');

describe('buildURL', () => {
  it('builds URL of collection', () => {
    const url = buildURL(Immutable.fromJS({ type: 'SPACESHIP' }));

    expect(url).toBe('/test_api/spaceships');
  });

  it('builds URL of entity', () => {
    const url = buildURL(Immutable.fromJS({ type: 'SPACESHIP', id: '100' }));

    expect(url).toBe('/test_api/spaceships/100');
  });

  it('builds URL of entity using parent type map', () => {
    const url = buildURL(Immutable.fromJS({ type: 'JET', id: '100' }));

    expect(url).toBe('/test_api/airplanes/100');
  });

  it('serializes filter params', () => {
    const url = buildURL(Immutable.fromJS({
      type: 'SPACESHIP',
      filterParams: { aB: 'space & atmosphere', o: 'asc' }
    }));

    const queryString = '?a_b=space%20%26%20atmosphere&o=asc'
    expect(url).toBe('/test_api/spaceships' + queryString);
  });
});
