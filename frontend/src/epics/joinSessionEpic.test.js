import { of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import {
  joinSession, markJobAsStarted, markJobAsSucceeded, markJobAsFailed, removeJob
} from '../actions';
import { ATTENDANCE, INTERACTIVE_SESSION } from '../constants/entityTypes';
import joinSessionEpic from './joinSessionEpic';

const action$ = of(
  joinSession('ABCD', 'jobId')
);
const state$ = null;

const entity = {
  id: 100,
  type: ATTENDANCE,
  relationships: {
    interactiveSession: {
      id: 200,
      type: INTERACTIVE_SESSION,
    },
  }
};
const setupCreateMock = () => (jest.fn((_) => of(entity)));
const setupPushMock = () => (jest.fn());

const callEpic = (createMock, pushMock) => {
  const dependencies = {
    api: { entities: { create: createMock || setupCreateMock() }},
    history: { push: pushMock || setupPushMock() },
  };
  return joinSessionEpic(action$, state$, dependencies).pipe(toArray())
};

describe('joinSessionEpic', () => {
  it('emits action to mark job as started', (done) => {
    const expectedAction = markJobAsStarted('jobId');

    const result$ = callEpic();
    result$.subscribe(actions => {
      expect(actions[0]).toEqual(expectedAction);
      done();
    });
  });

  it('emits action to remove job', (done) => {
    const expectedAction = removeJob('jobId');

    const result$ = callEpic();
    result$.subscribe(actions => {
      expect(actions.slice(-1)[0]).toEqual(expectedAction);
      done();
    });
  });

  it('triggers create request', (done) => {
    const createMock = setupCreateMock();

    const result$ = callEpic(createMock);
    result$.subscribe(_actions => {
      expect(createMock).toBeCalledWith({
        type: ATTENDANCE,
        attributes: { attendanceCode: 'ABCD' },
      });
      done();
    });
  });

  describe('when request succeeds', () => {
    it('redirects to interactive session', (done) => {
      const pushMock = setupPushMock();

      const result$ = callEpic(null, pushMock);
      result$.subscribe(_actions => {
        expect(pushMock).toBeCalledWith('/interactive_sessions/200');
        done();
      });
    });

    it('emits action to mark job as succeeded', (done) => {
      const expectedAction = markJobAsSucceeded('jobId', entity);

      const result$ = callEpic();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });

  describe('when request fails', () => {
    it('emits action to mark job as succeeded', (done) => {
      const errors = [{ title: 'error' }];
      const expectedAction = markJobAsFailed('jobId', errors);

      const error = new Error();
      error.response = { errors };
      const createMock = (_) => throwError(error);

      const result$ = callEpic(createMock);
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
