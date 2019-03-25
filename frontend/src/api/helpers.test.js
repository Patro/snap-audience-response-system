import {
  buildURL, buildBody,
  mapResourceObjectToEntity,
  mapSingleResourceToEntity,
  mapCollectionResourceToCollection
} from './helpers';

jest.mock('./config');

describe('buildURL', () => {
  it('builds URL of collection', () => {
    const url = buildURL({ type: 'SPACESHIP' });

    expect(url).toBe('/test_api/spaceships');
  });

  it('builds URL of entity', () => {
    const url = buildURL({ type: 'SPACESHIP', id: 100 });

    expect(url).toBe('/test_api/spaceships/100');
  });

  it('builds URL of entity using parent type map', () => {
    const url = buildURL({ type: 'JET', id: 100 });

    expect(url).toBe('/test_api/airplanes/100');
  });

  it('serializes filter params', () => {
    const url = buildURL({
      type: 'SPACESHIP',
      filterParams: { aB: 'space & atmosphere', o: 'asc' }
    });

    const queryString = '?a_b=space%20%26%20atmosphere&o=asc'
    expect(url).toBe('/test_api/spaceships' + queryString);
  });
});

describe('buildBody', () => {
  it('builds hash with id', () => {
    const body = buildBody({ id: 3 });

    expect(body).toEqual({ data: { id: 3 }});
  });

  it('builds hash with type', () => {
    const body = buildBody({ type: 'SPACESHIP' });

    expect(body).toEqual({ data: { type: 'spaceship' }});
  });

  it('builds hash with attributes', () => {
    const body = buildBody({
      attributes: { initialAuthor: { firstName: 'John' } }
    });

    const expectedBody = {
      data: {
        attributes: {
          initial_author: {
            first_name: 'John'
          }
        }
      }
    };
    expect(body).toEqual(expectedBody);
  });

  it('builds hash with relationships', () => {
    const body = buildBody({
      relationships: { initialAuthor: { id: 1, type: 'AUTHOR' } }
    });

    const expectedBody = {
      data: {
        relationships: {
          initial_author: {
            data: {
              id: 1,
              type: 'author',
            },
          },
        },
      },
    };
    expect(body).toEqual(expectedBody);
  });
});

describe('mapResourceObjectToEntity', () => {
  it('maps id', () => {
    const entity = mapResourceObjectToEntity({ id: 3 });

    expect(entity).toEqual({ id: 3 });
  });

  it('maps type', () => {
    const entity = mapResourceObjectToEntity({ type: 'spaceship_engine' });

    expect(entity).toEqual({ type: 'SPACESHIP_ENGINE' });
  });

  it('maps attributes', () => {
    const entity = mapResourceObjectToEntity({
      attributes: {
        max_speed: 100000,
      },
    });

    expect(entity).toEqual({
      attributes: {
        maxSpeed: 100000,
      },
    });
  });

  it('maps to one relationship', () => {
    const entity = mapResourceObjectToEntity({
      relationships: {
        spaceship_engine: {
          data: {
            type: 'spaceship',
            id: 430,
          },
        },
      },
    });

    expect(entity).toEqual({
      relationships: {
        spaceshipEngine: {
          type: 'SPACESHIP',
          id: 430,
        },
      },
    });
  });

  it('maps to many relationship', () => {
    const entity = mapResourceObjectToEntity({
      relationships: {
        spaceship_engines: {
          data: [
            { type: 'spaceship', id: 430 },
            { type: 'spaceship', id: 431 },
          ],
        },
      },
    });

    expect(entity).toEqual({
      relationships: {
        spaceshipEngines: [
          { type: 'SPACESHIP', id: 430 },
          { type: 'SPACESHIP', id: 431 },
        ],
      },
    });
  });

  it('maps empty object', () => {
    const entity = mapResourceObjectToEntity({});

    expect(entity).toEqual({});
  });
});

describe('mapSingleResourceToEntity', () => {
  it('maps document to entity', () => {
    const entity = mapSingleResourceToEntity({
      data: {
        id: 100,
        type: 'spaceship',
        attributes: {
          max_speed: 100,
        },
      }
    });

    expect(entity).toEqual({
      id: 100,
      type: 'SPACESHIP',
      attributes: {
        maxSpeed: 100,
      },
    });
  });
});

describe('mapCollectionResourceToCollection', () => {
  it('maps document to collection', () => {
    const entity = mapCollectionResourceToCollection({
      data: [
        {
          id: 100,
          type: 'spaceship',
          attributes: {
            max_speed: 100,
          },
        },
      ]
    });

    expect(entity).toEqual({
      entities: [
        {
          id: 100,
          type: 'SPACESHIP',
          attributes: {
            maxSpeed: 100,
          },
        },
      ],
    });
  });
});
