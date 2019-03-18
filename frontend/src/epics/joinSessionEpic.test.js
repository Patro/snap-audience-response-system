import { of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import joinSessionEpic from './joinSessionEpic';

const mockResponse = { type: 'ATTENDANCE' };
const action$ = of({ type: 'JOIN_SESSION', attendanceCode: 'ABCD' });
const state$ = null;

describe('join session epic', () => {
  it('triggers create request', (done) => {
    const createMock = jest.fn((_) => of(mockResponse));
    const dependencies = { api: { entities: { create: createMock }}};
    const result$ = joinSessionEpic(action$, state$, dependencies).pipe(toArray());
    result$.subscribe((_) => {
      expect(createMock).toBeCalledWith({
        type: 'ATTENDANCE',
        attributes: { attendanceCode: 'ABCD' },
      });
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits no action', (done) => {
      const dependencies = { api: { entities: { create: (_) => of(mockResponse) }}};
      const result$ = joinSessionEpic(action$, state$, dependencies).pipe(toArray());
      result$.subscribe(actions => {
        expect(actions).toEqual([]);
        done();
      });
    });
  });

  describe('when request fails', () => {
    it('emits no action', (done) => {
      const dependencies = { api: { entities: { create: (_) => throwError(new Error()) }}};
      const result$ = joinSessionEpic(action$, state$, dependencies).pipe(toArray());
      result$.subscribe(actions => {
        expect(actions).toEqual([]);
        done();
      });
    });
  });
});
