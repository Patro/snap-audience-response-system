import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { fetchEntity, receiveEntity } from '../actions';
import fetchEntityEpic from './fetchEntityEpic';

const action$ = of(
  fetchEntity('SPACESHIP', '100')
);

const entity = {
  id: '100',
  type: 'SPACESHIP',
  attributes: { name: 'ENTERPRISE' },
};
const setupFetchMock = () => (jest.fn((_) => of(entity)));

const callEpic = (fetchMock = setupFetchMock()) => {
  const dependencies = { api: { entities: { fetch: fetchMock }} }
  return fetchEntityEpic(action$, null, dependencies).pipe(toArray())
};

describe('fetchEntityEpic', () => {
  it('triggers fetch request', (done) => {
    const fetchMock = setupFetchMock();

    const result$ = callEpic(fetchMock);
    result$.subscribe((_actions) => {
      expect(fetchMock).toBeCalledWith({ type: 'SPACESHIP', id: '100' });
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive entity action', (done) => {
      const expectedAction = receiveEntity(entity);

      const result$ = callEpic();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
