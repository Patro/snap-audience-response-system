import Immutable from 'immutable';
import buildBody from './buildBody';

describe('buildBody', () => {
  it('builds hash with id', () => {
    const body = buildBody(Immutable.fromJS({ id: '3' }));

    expect(body).toEqual(Immutable.fromJS({ data: { id: '3' }}));
  });

  it('builds hash with type', () => {
    const body = buildBody(Immutable.fromJS({ type: 'SPACESHIP' }));

    expect(body).toEqual(Immutable.fromJS({ data: { type: 'spaceship' }}));
  });

  it('builds hash with attributes', () => {
    const body = buildBody(Immutable.fromJS({
      attributes: { initialAuthor: { firstName: 'John' } }
    }));

    const expectedBody = Immutable.fromJS({
      data: {
        attributes: {
          initial_author: {
            first_name: 'John'
          }
        }
      }
    });
    expect(body).toEqual(expectedBody);
  });

  it('builds hash with relationships', () => {
    const body = buildBody(Immutable.fromJS({
      relationships: { initialAuthor: { id: '1', type: 'AUTHOR' } }
    }));

    const expectedBody = Immutable.fromJS({
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
    });
    expect(body).toEqual(expectedBody);
  });
});
