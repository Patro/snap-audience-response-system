import buildBody from './buildBody';

describe('buildBody', () => {
  it('builds hash with id', () => {
    const body = buildBody({ id: '3' });

    expect(body).toEqual({ data: { id: '3' }});
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
      relationships: { initialAuthor: { id: '1', type: 'AUTHOR' } }
    });

    const expectedBody = {
      data: {
        relationships: {
          initial_author: {
            data: {
              id: '1',
              type: 'author',
            },
          },
        },
      },
    };
    expect(body).toEqual(expectedBody);
  });
});
