import { of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ATTENDANCE, INTERACTIVE_SESSION } from '../constants/entityTypes';
import joinSessionEpic from './joinSessionEpic';

const action$ = of({ type: 'JOIN_SESSION', attendanceCode: 'ABCD' });
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

    it('emits no action', (done) => {
      const result$ = callEpic();
      result$.subscribe(actions => {
        expect(actions).toEqual([]);
        done();
      });
    });
  });

  describe('when request fails', () => {
    it('emits no action', (done) => {
      const createMock = (_) => throwError(new Error());

      const result$ = callEpic(createMock);
      result$.subscribe(actions => {
        expect(actions).toEqual([]);
        done();
      });
    });
  });
});
