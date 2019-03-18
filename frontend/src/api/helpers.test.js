import { buildURL, buildBody } from './helpers';

describe('buildURL', () => {
  it('builds URL of collection', () => {
    const url = buildURL({ type: 'SPACESHIP' });

    expect(url).toBe('/api/spaceships/');
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
});
