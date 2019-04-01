import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { startSession, receiveEntity } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import startSessionEpic from './startSessionEpic';

const action$ = of(
  startSession('My new session', 'jobId')
);
const state$ = null;

const entity = {
  id: 100,
  type: INTERACTIVE_SESSION,
};
const setupCreateMock = () => (jest.fn((_) => of(entity)));
const setupPushMock = () => (jest.fn());

const callEpic = (createMock, pushMock) => {
  const dependencies = {
    api: { entities: { create: createMock || setupCreateMock() }},
    history: { push: pushMock || setupPushMock() },
  };
  return startSessionEpic(action$, state$, dependencies).pipe(toArray())
};

describe('startSessionEpic', () => {
  it('triggers create request', (done) => {
    const createMock = setupCreateMock();

    const result$ = callEpic(createMock);
    result$.subscribe(_actions => {
      expect(createMock).toBeCalledWith({
        type: INTERACTIVE_SESSION,
        attributes: { label: 'My new session' },
      });
      done();
    });
  });

  describe('when request succeeds', () => {
    it('redirects to interactive session owner', (done) => {
      const pushMock = setupPushMock();

      const result$ = callEpic(null, pushMock);
      result$.subscribe(_actions => {
        expect(pushMock).toBeCalledWith('/interactive_sessions/100/owner');
        done();
      });
    });

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
