import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { createEntity, receiveEntity } from '../actions';
import createEntityEpic from './createEntityEpic';

const action$ = of(
  createEntity({ type: 'SPACESHIP' })
);

const entity = { id: 100, type: 'SPACESHIP' };
const setupCreateMock = () => (jest.fn((_) => of(entity)));

const callEpic = (createMock = setupCreateMock()) => {
  const dependencies = { api: { entities: { create: createMock }} }
  return createEntityEpic(action$, null, dependencies).pipe(toArray())
};

describe('createEntityEpic', () => {
  it('triggers create request', (done) => {
    const createMock = setupCreateMock();

    const result$ = callEpic(createMock);
    result$.subscribe((_actions) => {
      expect(createMock).toBeCalledWith({ type: 'SPACESHIP' });
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
