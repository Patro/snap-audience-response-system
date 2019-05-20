import Immutable from 'immutable';
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { createEntity, receiveEntity } from '../actions';
import createEntityEpic from './createEntityEpic';

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
  }

  get dependencies() {
    return { api: this.api };
  }

  call$() {
    return createEntityEpic(this.action$, this.state$, this.dependencies)
             .pipe(toArray());
  }
}

describe('createEntityEpic', () => {
  let epic;

  beforeEach(() => {
    epic = new TestWrapper({
      action$: of(
        createEntity({ type: 'SPACESHIP' })
      )
    });
  });

  it('triggers create request', (done) => {
    const result$ = epic.call$();
    result$.subscribe((_actions) => {
      const entity = Immutable.fromJS({ type: 'SPACESHIP' });
      expect(epic.api.entities.create).toBeCalledWith(entity);
      done();
    });
  });

  describe('when request succeeds', () => {
    it('emits receive entity action', (done) => {
      const expectedAction = receiveEntity({ id: '_1', type: 'SPACESHIP' });

      const result$ = epic.call$();
      result$.subscribe(actions => {
        expect(actions).toContainEqual(expectedAction);
        done();
      });
    });
  });
});
