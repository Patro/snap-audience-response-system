import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { fetchCollection, receiveCollection } from '../actions';
import fetchCollectionEpic from './fetchCollectionEpic';

const action$ = of(
  fetchCollection('SPACESHIP_ENGINE', { fuel: 'hydrogen' })
);

const collection = {
  type: 'SPACESHIP_ENGINE',
  filterParams: { fuel: 'hydrogen' },
  entities: [
    { id: '100', type: 'SPACESHIP_ENGINE', attributes: { fuel: 'hydrogen' } },
    { id: '101', type: 'SPACESHIP_ENGINE', attributes: { fuel: 'hydrogen' } },
  ]
};
const setupFetchMock = () => (jest.fn((_) => of(collection)));

const callEpic = (fetchMock = setupFetchMock()) => {
  const dependencies = { api: { collections: { fetch: fetchMock }} };
  return fetchCollectionEpic(action$, null, dependencies).pipe(toArray());
};

describe('fetchCollectionEpic', () => {
  it('triggers fetch request', (done) => {
    const fetchMock = setupFetchMock();

    const result$ = callEpic(fetchMock);
    result$.subscribe((_actions) => {
      expect(fetchMock).toBeCalledWith({
        type: 'SPACESHIP_ENGINE', filterParams: { fuel: 'hydrogen' },
      });
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive collection action', (done) => {
      const expectedAction = receiveCollection(collection)

      const result$ = callEpic();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
