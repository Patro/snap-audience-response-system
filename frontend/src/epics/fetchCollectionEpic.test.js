import { of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import fetchCollectionEpic from './fetchCollectionEpic';

const action$ = of({
  type: 'FETCH_COLLECTION',
  entityType: 'SPACESHIP_ENGINE',
  filterParams: { fuel: 'gas' }
});
const state$ = null;

const collection = {
  entities: [
    { id: 100, type: 'SPACESHIP_ENGINE', attributes: { fuel: 'gas' } },
    { id: 101, type: 'SPACESHIP_ENGINE', attributes: { fuel: 'gas' } },
  ]
};
const setupFetchMock = () => (jest.fn((_) => of(collection)));

const callEpic = (fetchMock = setupFetchMock()) => {
  const dependencies = { api: { entities: { fetchCollection: fetchMock }} };
  return fetchCollectionEpic(action$, state$, dependencies).pipe(toArray());
};

describe('fetchCollectionEpic', () => {
  it('triggers fetch request', (done) => {
    const fetchMock = setupFetchMock();

    const result$ = callEpic(fetchMock);
    result$.subscribe((_actions) => {
      expect(fetchMock).toBeCalledWith({
        type: 'SPACESHIP_ENGINE', filterParams: { fuel: 'gas' },
      });
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive collection action', (done) => {
      const expectedAction = {
        type: 'RECEIVE_COLLECTION',
        entityType: 'SPACESHIP_ENGINE',
        filterParams: { fuel: 'gas' },
        collection,
      };

      const result$ = callEpic();
      result$.subscribe(actions => {
        expect(actions).toEqual([expectedAction]);
        done();
      });
    });
  });

  describe('when request fails', () => {
    it('emits no action', (done) => {
      const fetchMock = (_) => throwError(new Error());

      const result$ = callEpic(fetchMock);
      result$.subscribe(actions => {
        expect(actions).toEqual([]);
        done();
      });
    });
  });
});
