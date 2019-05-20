import Immutable from 'immutable';
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { startSession, receiveEntity } from '../actions';
import { INTERACTIVE_SESSION } from '../constants/entityTypes';
import startSessionEpic from './startSessionEpic';

class TestWrapper {
  constructor({ action$ } = {}) {
    this.action$ = action$;
    this.state$ = of(Immutable.Map());
    this.api = {
      _id: 1,
      entities: {
        create: jest.fn(entity =>
          of(entity.set('id', '_' + this.api._id++))
        ),
      },
    };
    this.history = { push: jest.fn() };
  }

  get dependencies() {
    return { api: this.api, history: this.history };
  }

  call$() {
    return startSessionEpic(this.action$, this.state$, this.dependencies)
             .pipe(toArray());
  }
}

describe('startSessionEpic', () => {
  let epic;

  beforeEach(() => {
    epic = new TestWrapper({
      action$: of(
        startSession('My new session', 'jobId')
      )
    });
  });

  it('triggers create request', (done) => {
    const result$ = epic.call$();
    result$.subscribe(_actions => {
      const entity = Immutable.fromJS({
        type: INTERACTIVE_SESSION,
        attributes: { label: 'My new session' },
      });
      expect(epic.api.entities.create).toBeCalledWith(entity);
      done();
    });
  });

  describe('when request succeeds', () => {
    it('redirects to interactive session owner', (done) => {
      const result$ = epic.call$();
      result$.subscribe(_actions => {
        expect(epic.history.push)
          .toBeCalledWith('/interactive_sessions/_1/owner');
        done();
      });
    });

    it('emits receive entity action', (done) => {
      const expectedAction = receiveEntity({
        id: '_1',
        type: INTERACTIVE_SESSION,
        attributes: { label: 'My new session' },
      });

      const result$ = epic.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
