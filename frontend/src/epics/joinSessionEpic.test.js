import { of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { ATTENDANCE } from '../constants/entityTypes';
import joinSessionEpic from './joinSessionEpic';

const action$ = of({ type: 'JOIN_SESSION', attendanceCode: 'ABCD' });
const state$ = null;

const entity = {
  id: 100,
  type: ATTENDANCE
};
const setupCreateMock = () => (jest.fn((_) => of(entity)));

const callEpic = (createMock = setupCreateMock()) => {
  const dependencies = { api: { entities: { create: createMock }} }
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
