import { of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { fetchEntity, receiveEntity } from '../actions';
import fetchEntityEpic from './fetchEntityEpic';

const action$ = of(
  fetchEntity('SPACESHIP', 100)
);
const state$ = null;

const entity = {
  id: 100,
  type: 'SPACESHIP',
  attributes: { name: 'ENTERPRISE' },
};
const setupFetchMock = () => (jest.fn((_) => of(entity)));

const callEpic = (fetchMock = setupFetchMock()) => {
  const dependencies = { api: { entities: { fetch: fetchMock }} }
  return fetchEntityEpic(action$, state$, dependencies).pipe(toArray())
};

describe('fetchEntityEpic', () => {
  it('triggers fetch request', (done) => {
    const fetchMock = setupFetchMock();

    const result$ = callEpic(fetchMock);
    result$.subscribe((_actions) => {
      expect(fetchMock).toBeCalledWith({ type: 'SPACESHIP', id: 100 });
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive entity action', (done) => {
      const expectedAction = receiveEntity(entity);

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
