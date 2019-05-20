import Immutable from 'immutable';
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { fetchCollection, receiveCollection } from '../actions';
import fetchCollectionEpic from './fetchCollectionEpic';

class TestWrapper {
  constructor({ action$ } = {}) {
    this.action$ = action$;
    this.state$ = of(Immutable.Map());
    this.api = {
      collections: {
        fetch: jest.fn(collection =>
          of(collection.set('entities', Immutable.List()))
        ),
      },
    };
  }

  get dependencies() {
    return { api: this.api };
  }

  call$() {
    return fetchCollectionEpic(this.action$, this.state$, this.dependencies)
             .pipe(toArray());
  }
}

describe('fetchCollectionEpic', () => {
  let epic;

  beforeEach(() => {
    epic = new TestWrapper({
      action$: of(
        fetchCollection('SPACESHIP_ENGINE', { fuel: 'hydrogen' })
      )
    });
  });

  it('triggers fetch request', (done) => {
    const result$ = epic.call$();
    result$.subscribe((_actions) => {
      const collection = Immutable.fromJS({
        type: 'SPACESHIP_ENGINE',
        filterParams: { fuel: 'hydrogen' },
      });
      expect(epic.api.collections.fetch).toBeCalledWith(collection);
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive collection action', (done) => {
      const expectedAction = receiveCollection({
        type: 'SPACESHIP_ENGINE',
        filterParams: { fuel: 'hydrogen' },
        entities: [],
      })

      const result$ = epic.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
