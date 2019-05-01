import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { joinSession, receiveEntity } from '../actions';
import { ATTENDANCE, INTERACTIVE_SESSION } from '../constants/entityTypes';
import joinSessionEpic from './joinSessionEpic';

const action$ = of(
  joinSession('ABCD', 'jobId')
);
const state$ = of({});

const entity = {
  id: '100',
  type: ATTENDANCE,
  relationships: {
    interactiveSession: {
      id: '200',
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
