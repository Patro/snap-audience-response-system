import Immutable from 'immutable';
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { joinSession, receiveEntity } from '../actions';
import { ATTENDANCE, INTERACTIVE_SESSION } from '../constants/entityTypes';
import joinSessionEpic from './joinSessionEpic';

class TestWrapper {
  constructor({ action$ } = {}) {
    this.action$ = action$;
    this.state$ = of(Immutable.Map());
    this.api = {
      _id: 1,
      entities: {
        create: jest.fn(entity => of(
          entity.merge(Immutable.fromJS({
            id: '_' + this.api._id++,
            relationships: {
              interactiveSession: {
                id: '200',
                type: INTERACTIVE_SESSION,
              },
            }
          }))
        )),
      },
    };
    this.history = { push: jest.fn() };
  }

  get dependencies() {
    return { api: this.api, history: this.history };
  }

  call$() {
    return joinSessionEpic(this.action$, this.state$, this.dependencies)
             .pipe(toArray());
  }
}

describe('joinSessionEpic', () => {
  let epic;

  beforeEach(() => {
    epic = new TestWrapper({
      action$: of(
        joinSession('ABCD', 'jobId')
      )
    });
  });

  it('triggers create request', (done) => {
    const result$ = epic.call$();
    result$.subscribe(_actions => {
      const entity = Immutable.fromJS({
        type: ATTENDANCE,
        attributes: { attendanceCode: 'ABCD' },
      });
      expect(epic.api.entities.create).toBeCalledWith(entity);
      done();
    });
  });

  describe('when request succeeds', () => {
    it('redirects to interactive session', (done) => {
      const result$ = epic.call$();
      result$.subscribe(_actions => {
        expect(epic.history.push).toBeCalledWith('/interactive_sessions/200');
        done();
      });
    });

    it('emits receive entity action', (done) => {
      const expectedAction = receiveEntity({
        id: '_1',
        type: ATTENDANCE,
        attributes: { attendanceCode: 'ABCD' },
        relationships: {
          interactiveSession: {
            id: '200',
            type: INTERACTIVE_SESSION,
          },
        }
      });

      const result$ = epic.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
